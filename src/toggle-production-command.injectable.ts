import { getCommandInjectableBunch } from "@k8slens/command-palette-contracts";
import { computed } from "mobx";
import { productionStateInjectable } from "./production-state.injectable";

export default getCommandInjectableBunch({
  id: "production-cluster-mark.toggle-production",
  title: {
    instantiate: (di) => {
      const state = di.inject(productionStateInjectable)();

      return () =>
        computed(() =>
          state.isActiveClusterProduction.get()
            ? "Production Cluster Mark: Unmark this cluster as production"
            : "Production Cluster Mark: Mark this cluster as production",
        );
    },
  },
  isActive: {
    instantiate: (di) => {
      const state = di.inject(productionStateInjectable)();

      return () => computed(() => state.activeClusterId.get() !== undefined);
    },
  },
  action: {
    instantiate: (di) => {
      const state = di.inject(productionStateInjectable)();

      return () => () => {
        const clusterId = state.activeClusterId.get();

        if (clusterId) {
          state.toggle(clusterId);
        }
      };
    },
  },
});
