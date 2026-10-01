import { getTopBarItemInjectableBunch } from "@k8slens/top-bar-contracts";
import { useInject } from "@k8slens/use-inject";
import { observer } from "mobx-react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { markSettingsInjectable, thicknessInPixels } from "./mark-settings.injectable";
import { productionStateInjectable } from "./production-state.injectable";
import styles from "./production-overlay.module.scss";

const markVariables = (color: string, thickness: number) =>
  ({ "--mark-color": color, "--mark-thickness": `${thickness}px` }) as CSSProperties;

// Takes no room in the top bar: it only hosts the window-wide edge and strip, portalled to the body.
const ProductionMark = observer(() => {
  const cluster = useInject(productionStateInjectable)().activeProductionCluster.get();
  const { markers } = useInject(markSettingsInjectable)().settings.get();
  const pixelsOf = (id: "border" | "topStrip") => thicknessInPixels[markers[id].thickness ?? "thin"];

  if (!cluster) {
    return null;
  }

  return createPortal(
    <>
      {markers.border.enabled && (
        <div
          className={`${styles.mark} ${styles.border}`}
          style={markVariables(markers.border.color, pixelsOf("border"))}
          aria-hidden
        />
      )}
      {markers.topStrip.enabled && (
        <div
          className={`${styles.mark} ${styles.topBar}`}
          style={markVariables(markers.topStrip.color, pixelsOf("topStrip"))}
          aria-hidden
        />
      )}
    </>,
    document.body,
  );
});

export default getTopBarItemInjectableBunch({
  id: "production-cluster-mark-top-bar-item",
  side: "left",
  orderNumber: 1000,
  Component: ProductionMark,
});
