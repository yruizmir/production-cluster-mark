// Black or white, whichever reads better on the given "#rrggbb" background.
export const textColorOn = (background: string) => {
  const match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(background);

  if (!match) {
    return "#ffffff";
  }

  const [red, green, blue] = match.slice(1).map((hex) => parseInt(hex, 16));
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.6 ? "#000000" : "#ffffff";
};
