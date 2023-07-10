import { getGenreByStyle } from "../discogs/genres.js";
import { isEmptyObject, isObject, isString } from "../modules/helpers.js";

let mapping = {};

export function getMapping() {
  if (!isEmptyObject(mapping)) {
    return mapping;
  }

  for (const key in keywordMapping) {
    if (keywordMapping.hasOwnProperty(key)) {
      const value = keywordMapping[key];
      mapping[key] = isString(value) ? new Style(value) : value;
    }
  }

  return mapping;
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
  "ambient": "Ambient",
  "drone": "Drone",
  "dark ambient": "Dark Ambient",
  "darkwave": "Darkwave",
  "experimental": "Experimental",
  "folk": "Folk",
  "industrial": "Industrial",
  "martial": "Military",
  "neoclassical": "Neo-Classical",
  "neofolk": "Neofolk",
  "nordic": "Nordic",
  // Combined tags
  "bombastic": ["martial industrial", "neoclassical"],
  "martial industrial": ["martial", "industrial"],
  "martial folk": ["martial", "neofolk"],
  // Aliases
  "darkambient": ["dark ambient"],
  "martial-industrial": ["martial industrial"],
  "neo-folk": ["neofolk"],
  "neoklassik": ["neoclassical"],
  "neo-classical": ["neoclassical"],
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
