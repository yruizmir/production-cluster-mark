import { clusterNavigatorItemKind } from "@k8slens/cluster-contracts";
import { DropDownMenuItemRow } from "@k8slens/drop-down-menu-items";
import {
  getNavigatorItemMenuItemInjectableBunch,
  navigatorItemDropDownMenuOrderNumbers,
  type NavigatorItemOfKind,
} from "@k8slens/navigator-contracts";
import { useInject } from "@k8slens/use-inject";
import { observer } from "mobx-react";
import { productionStateInjectable } from "./production-state.injectable";

const ToggleProduction = observer(({ data }: { data: NavigatorItemOfKind<typeof clusterNavigatorItemKind> }) => {
  const state = useInject(productionStateInjectable)();
  const clusterId = data.ids[data.ids.length - 1];

  return (
    <DropDownMenuItemRow $onClick={() => state.toggle(clusterId)}>
      {state.isProduction(clusterId) ? "Unmark as production" : "Mark as production"}
    </DropDownMenuItemRow>
  );
});

export default getNavigatorItemMenuItemInjectableBunch({
  id: "production-cluster-mark-toggle-production",
  forItemsOfKind: clusterNavigatorItemKind,
  orderNumber: navigatorItemDropDownMenuOrderNumbers.sectionEnd + 100,
  Component: ToggleProduction,
});
