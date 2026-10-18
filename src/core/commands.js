/* Dependency-injected command lifecycle. No DOM, storage or game rules here. */
const CommandLifecycle = (() => {
  function create(host) {
    let current = null;
    function cancel(reason = "cancelled") {
      const tx = current;
      if (!tx) return false;
      current = null;
      tx.cancelled = true;
      host.restore(tx.before);
      host.result({ ok: false, cancelled: true, reason });
      host.render();
      return true;
    }
    function fail(tx, error) {
      if (current !== tx) return;
      cancel(String(error.message || error));
      host.error(error);
    }
    function finish(tx) {
      if (current !== tx || tx.waiting) return;
      try {
        host.validate();
        current = null;
        const saved = host.persist();
        if (!saved.ok && !tx.retainOnPersistenceFailure) {
          tx.cancelled = true;
          host.restore(tx.before);
          host.result({ ok: false, error: saved.error });
          host.error(Error(saved.error));
        } else {
          host.result({
            ok: true,
            persisted: !!saved.ok,
            ...(!saved.ok ? { error: saved.error } : {}),
          });
          if (!saved.ok) host.warning(saved.error);
        }
        host.render();
      } catch (error) {
        // persist may itself throw, including in a test/storage adapter.
        current = tx;
        fail(tx, error);
      }
    }
    function run(description, operation, options = {}) {
      if (host.active()) return false;
      host.invalidate(); // Cancels any older pending command before the new snapshot.
      cancel("superseded");
      const tx = {
        before: host.snapshot(),
        waiting: 0,
        retainOnPersistenceFailure:
          options.retainOnPersistenceFailure !== false,
      };
      current = tx;
      try {
        host.record(description);
        host.setActive(true);
        const result = operation();
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
      isPending: () => !!current,
      baseline: () => current?.before,
    };
  }
  return { create };
})();
