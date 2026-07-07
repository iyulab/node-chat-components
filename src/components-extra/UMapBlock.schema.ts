import type { ElementSchema } from '../types/Schema.js';

const schema: ElementSchema = {
  tag: 'u-map-block',
  description: 'Display a map showing a single location',
  properties: {
    lat: { type: "number", description: "Latitude coordinate" },
    lng: { type: "number", description: "Longitude coordinate" },
    zoom: {
      type: "integer",
      minimum: 1,
      maximum: 20,
      default: 15,
      description: "Map zoom level"
    },
    label: { type: "string", description: "Location title" },
    description: { type: "string", description: "Location description" }
  },
  required: ["lat", "lng"],
};

export default schema;
