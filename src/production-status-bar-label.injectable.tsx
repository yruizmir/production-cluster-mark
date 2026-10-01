import { getInjectable2 } from "@k8slens/injectable";
import { statusBarItemInjectionToken, type StatusBarItem } from "@k8slens/status-bar-contracts";
import { useInject } from "@k8slens/use-inject";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { markSettingsInjectable } from "./mark-settings.injectable";
import { ProductionLabel } from "./production-label";
import { productionStateInjectable } from "./production-state.injectable";

const ProductionStatusBarLabel = observer(() => {
  const cluster = useInject(productionStateInjectable)().activeProductionCluster.get();
  const { color } = useInject(markSettingsInjectable)().marker("statusBarLabel");

  return <ProductionLabel color={color} clusterName={cluster?.name} />;
});

export const productionStatusBarLabelInjectable = getInjectable2({
  id: "production-cluster-mark-status-bar-label",

  instantiate: (di) => {
    const state = di.inject(productionStateInjectable)();
    const { marker } = di.inject(markSettingsInjectable)();

    return (): StatusBarItem => ({
      Component: ProductionStatusBarLabel,
      position: "left",
      orderNumber: 10,
      isVisible: computed(() => state.isActiveClusterProduction.get() && marker("statusBarLabel").enabled),
    });
  },

  injectionToken: statusBarItemInjectionToken,
});
