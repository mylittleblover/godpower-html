/* Deterministic ownership for view-scoped UI work. No business operation belongs here. */
(function installGodPowerDisposableScope(root) {
  "use strict";

  function createDisposableScope(route = "") {
    let disposed = false;
    const cleanups = [];
    const abortController = new AbortController();

    function removeCleanup(entry) {
      const index = cleanups.indexOf(entry);
      if (index >= 0) cleanups.splice(index, 1);
    }

    function add(cleanup) {
      if (typeof cleanup !== "function")
        throw new TypeError("cleanup must be a function");
      let active = true;
      const entry = () => {
        if (!active) return;
        active = false;
        cleanup();
      };
      if (disposed) {
        entry();
        return () => {};
      }
      cleanups.push(entry);
      return () => {
        removeCleanup(entry);
        entry();
      };
    }

    function listen(target, type, listener, options) {
      if (!target?.addEventListener || !target?.removeEventListener) {
        throw new TypeError(
          "event target must support addEventListener/removeEventListener",
        );
      }
      if (disposed) return () => {};
      // Removal matches capture at registration time, not a mutable options object.
      const capture =
        typeof options === "boolean" ? options : !!options?.capture;
      let release;
      const registered = options?.once
        ? function (event) {
            release();
            if (typeof listener === "function") listener.call(this, event);
            else listener?.handleEvent(event);
          }
        : listener;
      target.addEventListener(type, registered, options);
      release = add(() =>
        target.removeEventListener(type, registered, capture),
      );
      return release;
    }

    function timeout(callback, delay = 0) {
      if (typeof callback !== "function")
        throw new TypeError("timeout callback must be a function");
      if (disposed) return null;
      let release;
      const id = setTimeout(() => {
        release?.();
        if (!disposed) callback();
      }, delay);
      release = add(() => clearTimeout(id));
      return id;
    }

    function frame(callback) {
      if (typeof callback !== "function")
        throw new TypeError("frame callback must be a function");
      if (disposed) return null;
      let release;
      const id = requestAnimationFrame((time) => {
        release?.();
        if (!disposed) callback(time);
      });
      release = add(() => cancelAnimationFrame(id));
      return id;
    }

    function observe(observer, target, options) {
      if (!observer?.observe || !observer?.disconnect) {
        throw new TypeError("observer must support observe/disconnect");
      }
      if (disposed) {
        observer.disconnect();
        return observer;
      }
      observer.observe(target, options);
      add(() => observer.disconnect());
      return observer;
    }

    function animation(animation) {
      if (!animation?.cancel)
        throw new TypeError("animation must support cancel");
      if (disposed) {
        animation.cancel();
        return animation;
      }
      const release = add(() => animation.cancel());
      if (animation.finished?.then) animation.finished.then(release, release);
      return animation;
    }

    function child(childScope) {
      if (!childScope?.dispose)
        throw new TypeError("child scope must support dispose");
      add(() => childScope.dispose());
      return childScope;
    }

    function dispose() {
      if (disposed) return [];
      disposed = true;
      const errors = [];
      try {
        abortController.abort();
      } catch (error) {
        errors.push(error);
      }
      for (const cleanup of cleanups.splice(0).reverse()) {
        try {
          cleanup();
        } catch (error) {
          errors.push(error);
        }
      }
      return errors;
    }

    return Object.freeze({
      route,
      add,
      listen,
      timeout,
      frame,
      observe,
      animation,
      child,
      dispose,
      get disposed() {
        return disposed;
      },
      get signal() {
        return abortController.signal;
      },
      get size() {
        return cleanups.length;
      },
    });
  }

  function createPageLifecycle(
    onDisposeError = (route, errors) => {
      for (const error of errors)
        console.error(`UI scope cleanup failed (${route})`, error);
    },
  ) {
    let active = null;

    function enter(route) {
      if (typeof route !== "string" || !route || route.length > 192) {
        throw new TypeError(
          "page route must be a non-empty string up to 192 characters",
        );
      }
      if (active?.route === route)
        return Object.freeze({ route, scope: active, changed: false });
      if (active) {
        const previous = active;
        const errors = previous.dispose();
        if (errors.length) onDisposeError(previous.route, errors);
      }
      active = createDisposableScope(route);
      return Object.freeze({ route, scope: active, changed: true });
    }

    function dispose() {
      if (!active) return [];
      const previous = active;
      active = null;
      const errors = previous.dispose();
      if (errors.length) onDisposeError(previous.route, errors);
      return errors;
    }

    return Object.freeze({
      enter,
      dispose,
      current: () => active,
    });
  }

  root.GodPowerDisposableScope = Object.freeze({
    createDisposableScope,
    createPageLifecycle,
  });
  if (typeof document !== "undefined" && !root.GodPowerPageLifecycle) {
    root.GodPowerPageLifecycle = createPageLifecycle();
  }
})(globalThis);
