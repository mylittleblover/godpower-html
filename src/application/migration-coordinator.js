/* Staging-only migration orchestration. Authority cutover is a separate application command. */
const MigrationCoordinator = (() => {
  function create({ inventory, openRepository, sourceOptions = {} }) {
    if (!inventory || typeof openRepository !== "function")
      throw new TypeError(
        "Inventory and target repository factory are required",
      );
    async function preview() {
      const captured = await inventory.capture(sourceOptions);
      if (!captured.ready)
        return {
          ok: false,
          status: "SOURCE_UNSTABLE",
          conflicts: captured.conflicts,
        };
      const plan = await inventory.prepare(captured);
      return {
        ok: true,
        status: "PREVIEW",
        migrationId: plan.migrationId,
        aggregateId: plan.aggregateId,
        sourceOrigin: plan.sourceOrigin,
        counts: {
          groups: plan.snapshot.groups.length,
          archives: plan.archives.length,
          resources: plan.resources.length,
        },
      };
    }
    async function execute(selected, { signal } = {}) {
      let repository = null;
      let stage = "read-source";
      const cancelled = () => {
        if (signal?.aborted) {
          const error = new Error("迁移已取消，来源保持不变");
          error.code = "CANCELLED";
          throw error;
        }
      };
      try {
        cancelled();
        // Re-read payloads rather than trusting a mutable UI preview or imported plan.
        const captured = await inventory.capture(sourceOptions);
        if (!captured.ready)
          return {
            ok: false,
            status: "SOURCE_CHANGED",
            authorityChanged: false,
            conflicts: captured.conflicts,
          };
        const plan = await inventory.prepare(captured);
        if (
          !selected?.ok ||
          selected.migrationId !== plan.migrationId ||
          selected.aggregateId !== plan.aggregateId ||
          selected.sourceOrigin !== plan.sourceOrigin
        )
          return {
            ok: false,
            status: "SOURCE_CHANGED",
            authorityChanged: false,
            conflicts: ["预览之后来源或目标范围已变化，请重新预检"],
          };
        stage = "verify-source";
        const sourceBefore = await inventory.verify(plan, sourceOptions);
        if (!sourceBefore.ok)
          return {
            ok: false,
            status: "SOURCE_CHANGED",
            authorityChanged: false,
            conflicts: sourceBefore.conflicts,
          };
        cancelled();
        stage = "open-target";
        repository = await openRepository(plan);
        cancelled();
        stage = "import";
        const receipt = await repository.importSnapshot(plan);
        stage = "journal-verifying";
        await repository.recordMigrationStatus(plan, { status: "VERIFYING" });
        stage = "verify-target";
        const integrity = await inventory.verifyDestination(repository, plan);
        if (!integrity.ok) {
          await repository.recordMigrationStatus(plan, {
            status: "DESTINATION_INVALID",
            integrity,
          });
          return {
            ok: false,
            status: "DESTINATION_INVALID",
            authorityChanged: false,
            receipt,
            integrity,
          };
        }
        stage = "verify-source-after-import";
        const sourceAfter = await inventory.verify(plan, sourceOptions);
        if (!sourceAfter.ok) {
          await repository.recordMigrationStatus(plan, {
            status: "STAGED_SOURCE_CHANGED",
            integrity,
          });
          return {
            ok: false,
            status: "STAGED_SOURCE_CHANGED",
            authorityChanged: false,
            receipt,
            integrity,
            conflicts: sourceAfter.conflicts,
          };
        }
        stage = "journal-result";
        const completedStatus = signal?.aborted
          ? "CANCELLED_STAGED"
          : "VERIFIED";
        const journal = await repository.recordMigrationStatus(plan, {
          status: completedStatus,
          sourceRechecked: true,
          integrity,
        });
        return {
          ok: completedStatus === "VERIFIED",
          status:
            completedStatus === "VERIFIED"
              ? "STAGED_VERIFIED"
              : "CANCELLED_STAGED",
          authorityChanged: false,
          receipt,
          integrity,
          journal,
        };
      } catch (error) {
        return {
          ok: false,
          status: error.code === "CANCELLED" ? "CANCELLED" : "FAILED",
          stage,
          authorityChanged: false,
          error: String(error.message || error),
        };
      } finally {
        repository?.close();
      }
    }
    return { preview, execute };
  }
  return { create };
})();
