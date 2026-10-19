/* Dependency-injected command lifecycle. No DOM, storage or game rules here. */
const CommandLifecycle = (() => {
  function create(host) {
    let current = null;
    let committing = null;
    let persisting = null;
    let lastCompletion = Promise.resolve({
      ok: true,
      idle: true,
      persisted: false,
    });
    let generatedCommandId = 0;
    function context(tx) {
      return Object.freeze({
        commandId: tx.commandId,
        emit: (...args) => {
          if (current !== tx)
            throw Error("command no longer accepts domain events");
          if (!tx.eventScope) return false;
          return tx.eventScope.emit(...args);
        },
        onCommit: (finalizer) => {
          if (current !== tx)
            throw Error("command no longer accepts commit hooks");
          if (typeof finalizer !== "function")
            throw TypeError("commit hook must be a function");
          tx.finalizers.push(finalizer);
        },
      });
    }
    function notify(tx, callback) {
      try {
        callback();
      } catch (error) {
        try {
          if (host.postCommitError)
            host.postCommitError(error, { commandId: tx.commandId });
          else console.error("Command presentation failed", error);
        } catch (reportError) {
          console.error("Command error reporting failed", error, reportError);
        }
      }
    }
    function cancel(reason = "cancelled") {
      const tx = current;
      if (!tx) return false;
      current = null;
      tx.cancelled = true;
      tx.eventScope?.close();
      const outcome = { ok: false, cancelled: true, reason };
      try {
        host.restore(tx.before);
        host.result(outcome);
        host.render();
      } finally {
        tx.resolveCompletion(outcome);
      }
      return true;
    }
    function fail(tx, error) {
      if (current !== tx) return;
      cancel(String(error.message || error));
      host.error(error);
    }
    function finish(tx) {
      if (current !== tx || tx.waiting) return;
      let saved, transaction;
      try {
        tx.finalizers.forEach((finalizer) => finalizer(context(tx)));
        host.validate();
        current = null;
        transaction = {
          commandId: tx.commandId,
          events: tx.eventScope?.list() || [],
        };
        tx.eventScope?.close();
        // Block reentrant dispatch, but leave isPending() false during the
        // synchronous legacy save call so it does not defer its own persistence.
        committing = tx;
        saved = host.persist(transaction);
      } catch (error) {
        committing = null;
        persisting = null;
        current = tx;
        fail(tx, error);
        return;
      }
      if (saved && typeof saved.then === "function") {
        persisting = tx;
        notify(tx, () =>
          host.result({ ok: true, pending: true, persisted: false }),
        );
        Promise.resolve(saved)
          .then(
            (result) => acknowledge(tx, transaction, result),
            (error) =>
              acknowledge(tx, transaction, {
                ok: false,
                error: String(error?.message || error),
              }),
          )
          .catch((error) => notify(tx, () => host.error(error)));
      } else acknowledge(tx, transaction, saved);
    }
    function acknowledge(tx, transaction, saved) {
      // The durable acknowledgment is the boundary; UI failures cannot reverse it.
      persisting = null;
      let outcome;
      try {
        if (!saved || typeof saved.ok !== "boolean" || saved.deferred)
          saved = { ok: false, error: "存储没有返回有效的持久化确认" };
        outcome =
          !saved.ok && !tx.retainOnPersistenceFailure
            ? { ok: false, error: saved.error }
            : {
                ok: true,
                persisted: !!saved.ok,
                ...(!saved.ok ? { error: saved.error } : {}),
              };
        if (!saved.ok && !tx.retainOnPersistenceFailure) {
          tx.cancelled = true;
          host.restore(tx.before);
          notify(tx, () => host.result({ ok: false, error: saved.error }));
          notify(tx, () => host.error(Error(saved.error)));
        } else {
          notify(tx, () =>
            host.result({
              ok: true,
              persisted: !!saved.ok,
              ...(!saved.ok ? { error: saved.error } : {}),
            }),
          );
          if (!saved.ok) notify(tx, () => host.warning(saved.error));
        }
        if (
          saved.ok &&
          !saved.deferred &&
          saved.eventsPersisted === true &&
          transaction.events.length
        )
          notify(tx, () => host.committed?.(transaction));
        notify(tx, () => host.render());
      } finally {
        if (committing === tx) committing = null;
        tx.resolveCompletion(outcome || { ok: false, error: "命令确认失败" });
      }
    }
    function run(description, operation, options = {}) {
      if (host.active() || committing) return false;
      const commandId =
        options.commandId ||
        host.commandId?.() ||
        `command-${++generatedCommandId}`;
      const eventScope =
        host.createEventScope?.({
          commandId,
          actorId: options.actorId ?? host.actorId?.() ?? null,
          source: options.source || "classroom",
        }) || null;
      host.invalidate(); // Cancels any older pending command before the new snapshot.
      cancel("superseded");
      const before = host.snapshot();
      let resolveCompletion;
      const completion = new Promise((resolve) => {
        resolveCompletion = resolve;
      });
      lastCompletion = completion;
      const tx = {
        commandId,
        completion,
        resolveCompletion,
        eventScope,
        finalizers: [],
        before,
        waiting: 0,
        retainOnPersistenceFailure:
          options.retainOnPersistenceFailure !== false,
      };
      current = tx;
      try {
        if (options.recordHistory !== false) host.record(description);
        host.setActive(true);
        const result = operation(context(tx));
        if (result === false) {
          cancel("rejected");
          return false;
        }
        host.validate();
      } catch (error) {
        fail(tx, error);
        return false;
      } finally {
        host.setActive(false);
      }
      if (tx.waiting)
        host.result({ ok: true, pending: true, persisted: false });
      else finish(tx);
      return !tx.cancelled;
    }
    function defer(promise, apply, isCurrent = () => true) {
      const tx = current;
      if (!tx) return false;
      tx.waiting++;
      Promise.resolve(promise)
        .then((value) => {
          if (current !== tx) return;
          if (!isCurrent()) {
            cancel("stale-defense");
            return;
          }
          host.setActive(true);
          try {
            apply(value);
            host.validate();
          } finally {
            host.setActive(false);
          }
          tx.waiting--;
          finish(tx);
        })
        .catch((error) => fail(tx, error));
      return true;
    }
    return {
      run,
      defer,
      cancel,
      isPending: () => !!(current || persisting),
      isCommitting: () => !!committing,
      whenIdle: () =>
        current?.completion || committing?.completion || lastCompletion,
      baseline: () => current?.before || committing?.before,
    };
  }
  return { create };
})();
