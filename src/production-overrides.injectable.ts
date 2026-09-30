import { getPersistableMapInjectableBunch } from "@k8slens/persistable-contracts";

// Cluster id -> whether the user has explicitly marked it as production (true) or not (false).
// Clusters without an entry fall back to detection by name.
export const productionOverridesBunch = getPersistableMapInjectableBunch<string, boolean>()({
  id: "production-overrides",
});
