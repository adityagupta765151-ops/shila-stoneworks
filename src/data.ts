export type Stone = { id: string; name: string; origin: string; kind: "Indian" | "Imported" | "Tile"; thick: string; finish: string; price: number; note: string; dark?: boolean };
export const STONES: Stone[] = [
  { id: "makrana", name: "Makrana White", origin: "Makrana, Rajasthan", kind: "Indian", thick: "18 mm", finish: "Polished", price: 420, note: "The stone of the Taj. Soft grey veins on a milky white." },
  { id: "statuario", name: "Statuario", origin: "Carrara, Italy", kind: "Imported", thick: "18 mm", finish: "Polished", price: 650, note: "Bold grey veins on bright white. For feature walls and living floors." },
  { id: "katni", name: "Katni Beige", origin: "Katni, Madhya Pradesh", kind: "Indian", thick: "16 mm", finish: "Honed", price: 95, note: "Warm beige with brown veins. Hides dust well on busy floors." },
  { id: "udaipur", name: "Udaipur Green", origin: "Rishabhdev, Rajasthan", kind: "Indian", thick: "18 mm", finish: "Polished", price: 180, note: "Deep green with white lightning veins. Made for pooja rooms and vanities.", dark: true },
  { id: "nero", name: "Nero Marquina", origin: "Basque Country, Spain", kind: "Imported", thick: "20 mm", finish: "Polished", price: 520, note: "Black with sharp white veins. Kitchen islands and bar counters.", dark: true },
  { id: "rosso", name: "Rosso Levanto", origin: "Liguria, Italy", kind: "Imported", thick: "20 mm", finish: "Polished", price: 480, note: "Wine-red with cream veins. One slab is enough to anchor a room.", dark: true },
  { id: "onyx", name: "Honey Onyx", origin: "Iran", kind: "Imported", thick: "18 mm", finish: "Backlit-ready", price: 890, note: "Translucent bands that glow when lit from behind." },
  { id: "terrazzo", name: "Terrazzo Tile", origin: "Morbi, Gujarat", kind: "Tile", thick: "10 mm", finish: "Matt", price: 120, note: "Chips of marble in cement. 60×60 cm tiles, laid like stone." },
];
export const IMG = (id: string, honed = false) => `./img/${id}${honed ? "-honed" : ""}.jpg`;
export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
