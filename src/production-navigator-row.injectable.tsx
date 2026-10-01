import { clusterNavigatorItemKind } from "@k8slens/cluster-contracts";
import { NavigatorItemLabel, NavigatorLeafIndicator } from "@k8slens/navigator-components";
import {
  getNavigatorItemKind,
  getNavigatorItemKindInjectableBunch,
  type NavigatorItemProps,
} from "@k8slens/navigator-contracts";
import { useInject } from "@k8slens/use-inject";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { markSettingsInjectable } from "./mark-settings.injectable";
import { ProductionLabel } from "./production-label";
import { productionStateInjectable } from "./production-state.injectable";

interface ProductionRow {
  readonly id: string;
  readonly name: string;
  readonly orderNumber: number;
}

// A single row, first under every cluster that counts as production.
const productionRowKind = getNavigatorItemKind<ProductionRow, [clusterId: string]>()("production-row");

const ProductionNavigatorRow = observer((_: NavigatorItemProps<ProductionRow, typeof clusterNavigatorItemKind>) => {
  const { color } = useInject(markSettingsInjectable)().marker("navigatorRow");

  return (
    <>
      <NavigatorLeafIndicator />
      <NavigatorItemLabel>
        <ProductionLabel color={color} />
      </NavigatorItemLabel>
    </>
  );
});

export default getNavigatorItemKindInjectableBunch({
  kind: productionRowKind,
  parentKind: clusterNavigatorItemKind,
  description: "Flags a production cluster with a coloured row at the top of its children.",

  items: {
    instantiate: (di) => {
      const state = di.inject(productionStateInjectable)();
      const { marker } = di.inject(markSettingsInjectable)();

      return async (clusterId) =>
        computed((): ProductionRow[] =>
          marker("navigatorRow").enabled && state.isProduction(clusterId)
            ? [{ id: "production", name: "PRODUCTION", orderNumber: 0 }]
            : [],
        );
    },
  },

  Component: ProductionNavigatorRow,
});
