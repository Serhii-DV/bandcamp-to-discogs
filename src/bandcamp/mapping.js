import { getGenreByStyle } from "../discogs/genres.js";
import { isObject } from "../modules/helpers.js";

export function getMapping() {
  return keywordMapping;
}

export class Style {
  constructor(style) {
    this.style = style;
    this._genre = null;
  }

  get genre() {
    return this._genre = (isObject(this._genre) ? this._genre : getGenreByStyle(this.style));
  }
}

const keywordMapping = {
  "ambient": new Style("Ambient"),
  "drone": new Style("Drone"),
  "dark ambient": new Style("Dark Ambient"),
  "darkwave": new Style("Darkwave"),
  "experimental": new Style("Experimental"),
  "folk": new Style("Folk"),
  "industrial": new Style("Industrial"),
  "martial": new Style("Military"),
  "neoclassical": new Style("Neo-Classical"),
  "neofolk": new Style("Neofolk"),
  "nordic": new Style("Nordic"),
  // Combined tags
  "bombastic": ["martial industrial", "neoclassical"],
  "martial industrial": ["martial", "industrial"],
  "martial folk": ["martial", "neofolk"],
  // Aliases
  "darkambient": "dark ambient",
  "martial-industrial": "martial industrial",
  "neo-folk": "neofolk",
  "neoklassik": "neoclassical",
  "neo-classical": "neoclassical",
  // Unknown?
  // "apocalyptic folk",
  // "atmospheric",
  // "cinematic",
  // "darkfolk",
  // "dark folk",
  // "dark horror",
  // "death industrial",
  // "field recordings",
  // "martial pop",
  // "modern classical",
  // "orchestral",
  // "post-industrial",
  // "power electronics",
  // "ritual",
  // "ritual dark ambient",
};
