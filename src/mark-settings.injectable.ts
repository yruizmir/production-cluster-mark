import { getInjectable2 } from "@k8slens/injectable";
import { getPersistableValueInjectableBunch } from "@k8slens/persistable-contracts";
import { action, computed, observable, type IObservableValue } from "mobx";

// Every place a production cluster can be marked, each shown or not, in a colour of its own.
export type MarkerId = "border" | "topStrip" | "topBarLabel" | "statusBarLabel" | "navigatorRow";
export type MarkThickness = "thin" | "medium" | "thick";

export interface Marker {
  readonly enabled: boolean;
  readonly color: string;
  // Only the window edge and the top strip have a thickness.
  readonly thickness?: MarkThickness;
}

export interface MarkSettings {
  readonly markers: Readonly<Record<MarkerId, Marker>>;
}

const red = "#e53935";

export const defaultMarkSettings: MarkSettings = {
  markers: {
    border: { enabled: true, color: red, thickness: "thin" },
    topStrip: { enabled: false, color: red, thickness: "medium" },
    topBarLabel: { enabled: true, color: red },
    statusBarLabel: { enabled: true, color: red },
    navigatorRow: { enabled: true, color: red },
  },
};

const markerIds = Object.keys(defaultMarkSettings.markers) as MarkerId[];

export const thicknessInPixels: Record<MarkThickness, number> = { thin: 3, medium: 6, thick: 10 };

export const markSettingsBunch = getPersistableValueInjectableBunch<MarkSettings>()({
  id: "markers",
  defaultValue: { instantiate: () => async () => defaultMarkSettings },
});

// The persisted settings, readable synchronously: the defaults until the stored value has been read.
export const markSettingsInjectable = getInjectable2({
  id: "production-cluster-mark-settings",

  instantiate: (di) => {
    const persisted = observable.box<IObservableValue<MarkSettings> | undefined>(undefined, { deep: false });

    void di.inject(markSettingsBunch.persistable)().then(action((box) => persisted.set(box)));

    // Fills in markers that settings saved by an older version do not have.
    const settings = computed((): MarkSettings => {
      const stored = persisted.get()?.get();

      return {
        markers: Object.fromEntries(
          markerIds.map((id) => [id, { ...defaultMarkSettings.markers[id], ...stored?.markers?.[id] }]),
        ) as Record<MarkerId, Marker>,
      };
    });

    const marker = (id: MarkerId) => settings.get().markers[id];

    const updateMarker = action((id: MarkerId, change: Partial<Marker>) => {
      const current = settings.get();

      persisted.get()?.set({ ...current, markers: { ...current.markers, [id]: { ...current.markers[id], ...change } } });
    });

    return () => ({ settings, marker, updateMarker });
  },
});
