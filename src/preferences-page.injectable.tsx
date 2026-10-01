import { Button, Div, Img, Input, Span, Table, Td, Th, Tr } from "@k8slens/element-components";
import { getExtensionPreferencePageInjectableBunch } from "@k8slens/preferences-contracts";
import { useInject } from "@k8slens/use-inject";
import { observer } from "mobx-react";
import banner from "../assets/banner.svg";
import icon from "../assets/icon.svg";
import packageJson from "../package.json";
import { type MarkerId, type MarkThickness, markSettingsInjectable } from "./mark-settings.injectable";

const asImage = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const markers: readonly { id: MarkerId; name: string; where: string }[] = [
  { id: "border", name: "Window edge", where: "Around the whole window" },
  { id: "topStrip", name: "Top strip", where: "Along the top of the window" },
  { id: "topBarLabel", name: "Top bar label", where: "PRODUCTION · cluster, in the top bar" },
  { id: "statusBarLabel", name: "Status bar label", where: "PRODUCTION · cluster, in the status bar" },
  { id: "navigatorRow", name: "Navigator row", where: "First row under each production cluster" },
];

const thicknesses: readonly { id: MarkThickness; label: string; name: string }[] = [
  { id: "thin", label: "S", name: "Thin" },
  { id: "medium", label: "M", name: "Medium" },
  { id: "thick", label: "L", name: "Thick" },
];

const presetColors = [
  { color: "#e53935", name: "Red" },
  { color: "#fb8c00", name: "Orange" },
  { color: "#fdd835", name: "Yellow" },
  { color: "#d81b60", name: "Magenta" },
  { color: "#8e24aa", name: "Purple" },
] as const;

const cell = { padding: "6px 12px 6px 0", verticalAlign: "middle" } as const;

// The extension as its details show it, so the page is recognisably the same extension.
const Header = () => (
  <Div $flex={{ direction: "vertical", gap: "m" }}>
    <Div $flex={{ direction: "horizontal", gap: "m", verticalAlign: "center" }}>
      <Img src={asImage(icon)} alt="" $style={{ width: 48, height: 48, borderRadius: 6 }} />
      <Span $font={{ size: "xl" }} $color="textMuted">
        {packageJson.name}@{packageJson.version}
      </Span>
    </Div>
    <Img src={asImage(banner)} alt="" $style={{ width: "100%", maxWidth: 520, borderRadius: 6 }} />
    <Span $color="textMuted">{packageJson.description}</Span>
  </Div>
);

const ColorPicker = ({ color, onPick }: { color: string; onPick: (color: string) => void }) => {
  const current = color.toLowerCase();

  return (
    <Div $flex={{ direction: "horizontal", gap: "xs", verticalAlign: "center" }}>
      {presetColors.map(({ color: preset, name }) => (
        <Button
          key={preset}
          role="radio"
          aria-checked={current === preset}
          aria-label={name}
          $tooltip={name}
          $onClick={() => onPick(preset)}
          $style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: preset,
            outline: current === preset ? "2px solid currentColor" : "none",
            outlineOffset: 2,
            border: "none",
            padding: 0,
          }}
        />
      ))}
      <Input
        type="color"
        aria-label="Colour of your own"
        title="Colour of your own"
        value={current}
        onChange={(event) => onPick(event.target.value)}
        $style={{ width: 26, height: 22, padding: 0, border: "none", background: "none", cursor: "pointer" }}
      />
    </Div>
  );
};

const ThicknessPicker = ({ value, onPick }: { value: MarkThickness; onPick: (value: MarkThickness) => void }) => (
  <Div role="radiogroup" aria-label="Thickness" $flex={{ direction: "horizontal", gap: "xxs" }}>
    {thicknesses.map(({ id, label, name }) => (
      <Button
        key={id}
        role="radio"
        aria-checked={value === id}
        $tooltip={name}
        $onClick={() => onPick(id)}
        $style={{
          width: 24,
          height: 22,
          padding: 0,
          borderRadius: 4,
          border: "1px solid currentColor",
          opacity: value === id ? 1 : 0.45,
          fontWeight: value === id ? 700 : 400,
        }}
      >
        {label}
      </Button>
    ))}
  </Div>
);

const MarkersTable = observer(() => {
  const { marker, updateMarker } = useInject(markSettingsInjectable)();

  return (
    <Table $style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <Tr>
          {["Show", "Mark", "Where", "Colour", "Thickness"].map((heading) => (
            <Th key={heading} $color="textMuted" $style={{ ...cell, textAlign: "left", fontWeight: 400 }}>
              {heading}
            </Th>
          ))}
        </Tr>
      </thead>
      <tbody>
        {markers.map(({ id, name, where }) => {
          const { enabled, color, thickness } = marker(id);

          return (
            <Tr key={id} $style={{ borderTop: "1px solid rgba(128, 128, 128, 0.2)" }}>
              <Td $style={cell}>
                <Input
                  type="checkbox"
                  aria-label={`Show the ${name.toLowerCase()}`}
                  checked={enabled}
                  onChange={() => updateMarker(id, { enabled: !enabled })}
                  $style={{ cursor: "pointer" }}
                />
              </Td>
              <Td $style={cell}>
                <Span $font={{ bold: true }} $faded={!enabled}>
                  {name}
                </Span>
              </Td>
              <Td $style={cell}>
                <Span $color="textMuted">{where}</Span>
              </Td>
              <Td $style={cell}>
                <ColorPicker color={color} onPick={(picked) => updateMarker(id, { color: picked })} />
              </Td>
              <Td $style={cell}>
                {thickness && (
                  <ThicknessPicker value={thickness} onPick={(picked) => updateMarker(id, { thickness: picked })} />
                )}
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
});

export default getExtensionPreferencePageInjectableBunch({
  packageJson,
  blocks: [
    { id: "header", orderNumber: 10, Component: Header },
    { id: "markers", orderNumber: 20, Component: MarkersTable },
  ],
});
