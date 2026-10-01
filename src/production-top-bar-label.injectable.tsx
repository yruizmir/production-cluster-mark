import { getTopBarItemInjectableBunch } from "@k8slens/top-bar-contracts";
import { useInject } from "@k8slens/use-inject";
import { observer } from "mobx-react";
import { markSettingsInjectable } from "./mark-settings.injectable";
import { ProductionLabel } from "./production-label";
import { productionStateInjectable } from "./production-state.injectable";

const ProductionTopBarLabel = observer(() => {
  const cluster = useInject(productionStateInjectable)().activeProductionCluster.get();
  const { enabled, color } = useInject(markSettingsInjectable)().marker("topBarLabel");

  return cluster && enabled ? <ProductionLabel color={color} clusterName={cluster.name} /> : null;
});

export default getTopBarItemInjectableBunch({
  id: "production-cluster-mark-top-bar-label",
  side: "left",
  orderNumber: 1010,
  Component: ProductionTopBarLabel,
});
