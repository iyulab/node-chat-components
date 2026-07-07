import type { ElementSchema } from '../types/Schema.js';

const schema: ElementSchema = {
  tag: 'u-images-block',
  description: 'Display multiple images in a scrollable gallery',
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          src: { type: "string", description: "Image URL" },
          alt: { type: "string", description: "Alt text for accessibility" },
          caption: { type: "string", description: "Image caption" }
        },
        required: ["src"]
      },
      minItems: 1,
      description: "Array of image objects"
    }
  },
  required: ["items"],
};

export default schema;
