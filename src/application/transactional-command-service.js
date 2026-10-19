/* Async application commands: immutable calculation, one repository commit, then presentation. */
const TransactionalCommandService = (() => {
  function fault(code, message) {
    const error = new Error(message);
    error.code = code;
    return error;
  }
  const freeze = DomainValues.deepFreeze;
  function text(value, field) {
    if (typeof value !== "string" || !value.trim() || value.length > 160)
      throw fault("INVALID_COMMAND", `${field} is required`);
    return value.trim();
  }
  function capture(raw) {
    let request;
    try {
      request = DomainValues.cloneJson(raw);
    } catch (error) {
      throw fault("INVALID_COMMAND", String(error.message || error));
    }
    if (!request || typeof request !== "object")
      throw fault("INVALID_COMMAND", "Command must be an object");
    if (
      !Number.isSafeInteger(request.expectedRevision) ||
      request.expectedRevision < 0
    )
      throw fault("INVALID_COMMAND", "expectedRevision is required");
    const source = text(request.source, "source");
    if (!DomainEvents.isValidSource(source))
      throw fault("INVALID_COMMAND", "Unsupported command source");
    return freeze({
      commandId: text(request.commandId, "commandId"),
      aggregateId: text(request.aggregateId, "aggregateId"),
      actorId: text(request.actorId, "actorId"),
      expectedRevision: request.expectedRevision,
      source,
      type: text(request.type, "type"),
      payload: request.payload ?? {},
    });
  }
  function create({
    repository,
    handlers,
    authorize,
    publish = () => {},
    reportPresentationError = (error) =>
      console.error("Committed command presentation failed", error),
    validateSnapshot = () => {},
    now = () => new Date(),
  }) {
    if (!repository || typeof authorize !== "function" || !handlers)
      throw new TypeError(
        "Repository, trusted handlers and authorization policy are required",
      );
    const inFlight = new Map();
    async function execute(request, { signal } = {}) {
      const checkCancelled = () => {
        if (signal?.aborted)
          throw fault("CANCELLED", "Command cancelled before commit");
      };
      checkCancelled();
      if (!(await authorize(request)))
        throw fault("FORBIDDEN", "Actor cannot modify this classroom scope");
      checkCancelled();
      const prior = await repository.findCommand(request.commandId, request);
      if (prior)
        return { ...prior, commandId: request.commandId, persisted: true };
      const handler = Object.hasOwn(handlers, request.type)
        ? handlers[request.type]
        : null;
      if (typeof handler !== "function")
        throw fault("INVALID_COMMAND", "Unsupported command type");
      const aggregate = await repository.read(request.aggregateId);
      if (!aggregate) throw fault("NOT_FOUND", "Classroom does not exist");
      if (aggregate.revision !== request.expectedRevision)
        throw fault("REVISION_CONFLICT", "Classroom revision changed");
      checkCancelled();
      const events = DomainEvents.createScope({
        commandId: request.commandId,
        actorId: request.actorId,
        source: request.source,
        now,
      });
      try {
        const context = Object.freeze({
          commandId: request.commandId,
          actorId: request.actorId,
          aggregateId: request.aggregateId,
          emit: events.emit,
          signal,
        });
        let outcome;
        try {
          outcome = DomainValues.cloneJson(
            await handler(
              freeze(DomainValues.cloneJson(aggregate.snapshot)),
              request.payload,
              context,
            ),
          );
        } catch (error) {
          checkCancelled();
          throw fault("OPERATION_FAILED", String(error.message || error));
        }
        checkCancelled();
        if (!outcome || !Object.hasOwn(outcome, "snapshot"))
          throw fault(
            "OPERATION_FAILED",
            "Handler must return an explicit next snapshot",
          );
        validateSnapshot(outcome.snapshot);
        const confirmedEvents = events.list();
        const receipt = await repository.commit({
          commandId: request.commandId,
          aggregateId: request.aggregateId,
          expectedRevision: request.expectedRevision,
          intent: request,
          snapshot: outcome.snapshot,
          events: confirmedEvents,
          archive: outcome.archive || null,
        });
        // Cancellation after a durable commit cannot pretend the command was undone.
        if (!receipt.duplicate && confirmedEvents.length) {
          try {
            await publish({
              commandId: request.commandId,
              aggregateId: request.aggregateId,
              revision: receipt.revision,
              events: confirmedEvents,
            });
          } catch (error) {
            try {
              await reportPresentationError(error, receipt);
            } catch (reportError) {
              console.error(
                "Presentation error reporting failed",
                error,
                reportError,
              );
            }
          }
        }
        return { ...receipt, commandId: request.commandId, persisted: true };
      } finally {
        events.close();
      }
    }
    function dispatch(raw, options) {
      let request;
      try {
        request = capture(raw);
      } catch (error) {
        return Promise.reject(error);
      }
      const intent = JSON.stringify(request);
      const existing = inFlight.get(request.commandId);
      if (existing)
        return existing.intent === intent
          ? existing.promise
          : Promise.reject(
              fault("COMMAND_REUSED", "In-flight command ID was reused"),
            );
      const promise = execute(request, options).finally(() => {
        inFlight.delete(request.commandId);
      });
      inFlight.set(request.commandId, { intent, promise });
      return promise;
    }
    return { dispatch, isPending: (commandId) => inFlight.has(commandId) };
  }
  return { create };
})();
