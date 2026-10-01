import { Badge } from "@k8slens/badge";
import { textColorOn } from "./text-color-on";

// "PRODUCTION · <cluster>" in the colour chosen for where it is shown.
export const ProductionLabel = ({ color, clusterName }: { color: string; clusterName?: string }) => (
  <Badge
    small
    label={clusterName ? `PRODUCTION · ${clusterName}` : "PRODUCTION"}
    $tooltip="This cluster is marked as production"
    $style={{ background: color, color: textColorOn(color), fontWeight: 600, letterSpacing: "0.04em" }}
  />
);
