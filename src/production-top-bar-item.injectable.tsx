import { getTopBarItemInjectableBunch } from "@k8slens/top-bar-contracts";
import { useInject } from "@k8slens/use-inject";
import { observer } from "mobx-react";
import { createPortal } from "react-dom";
import { productionStateInjectable } from "./production-state.injectable";
import styles from "./production-overlay.module.scss";

// Takes no room in the top bar: it only hosts the window-wide edge, portalled to the body.
const ProductionMark = observer(() => {
  const cluster = useInject(productionStateInjectable)().activeProductionCluster.get();

  return cluster ? createPortal(<div className={styles.frame} aria-hidden />, document.body) : null;
});

export default getTopBarItemInjectableBunch({
  id: "production-cluster-mark-top-bar-item",
  side: "left",
  orderNumber: 1000,
  Component: ProductionMark,
});
