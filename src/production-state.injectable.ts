import { allClusterRecordsReactiveInjectionToken, type ClusterRecord } from "@k8slens/cluster-contracts";
import { getInjectable2 } from "@k8slens/injectable";
import { activeTabClusterIdReactiveInjectionToken } from "@k8slens/main-view-contracts";
import { action, computed, type IComputedValue, observable, type ObservableMap } from "mobx";
import { isProductionName } from "./is-production-name";
import { productionOverridesBunch } from "./production-overrides.injectable";

export interface ActiveProductionCluster {
  readonly id: string;
  readonly name: string;
}

export const productionStateInjectable = getInjectable2({
  id: "production-cluster-mark-state",
  consumptions: [allClusterRecordsReactiveInjectionToken, activeTabClusterIdReactiveInjectionToken],

  instantiate: (di) => {
    const activeClusterId = di.inject(activeTabClusterIdReactiveInjectionToken)();
    const overrides = observable.box<ObservableMap<string, boolean> | undefined>(undefined, { deep: false });
    const clusterRecords = observable.box<IComputedValue<ClusterRecord[]> | undefined>(undefined, { deep: false });

    void di.inject(productionOverridesBunch.persistable)().then(action((map) => overrides.set(map)));
    void di.inject(allClusterRecordsReactiveInjectionToken)().then(action((records) => clusterRecords.set(records)));

    const nameOf = (clusterId: string) =>
      clusterRecords.get()?.get().find((record) => record.id === clusterId)?.name.get();

    const isProduction = (clusterId: string) => {
      const override = overrides.get()?.get(clusterId);

      if (override !== undefined) {
        return override;
      }

      const name = nameOf(clusterId);

      return name ? isProductionName(name) : false;
    };

    const activeProductionCluster = computed((): ActiveProductionCluster | undefined => {
      const clusterId = activeClusterId.get();

      if (!clusterId || !isProduction(clusterId)) {
        return undefined;
      }

      return { id: clusterId, name: nameOf(clusterId) ?? clusterId };
    });

    const setProduction = action((clusterId: string, value: boolean) => {
      overrides.get()?.set(clusterId, value);
    });

    return () => ({
      isProduction,
      activeProductionCluster,
      isActiveClusterProduction: computed(() => activeProductionCluster.get() !== undefined),
      activeClusterId,
      toggle: (clusterId: string) => setProduction(clusterId, !isProduction(clusterId)),
    });
  },
});
