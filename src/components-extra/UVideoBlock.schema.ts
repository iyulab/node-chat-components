import type { ElementSchema } from '../types/Schema.js';

const schema: ElementSchema = {
  tag: 'u-video-block',
  description: 'Embed video from YouTube, Vimeo, or Others. Provide a direct video file URL or a platform URL.',
  properties: {
    src: { type: "string", description: "Video URL (YouTube, Vimeo, or direct video file URL)" },
    poster: { type: "string", description: "Poster image URL" },
    ratio: {
      type: "string",
      enum: ["16:9", "4:3", "1:1"],
      default: "16:9",
      description: "Video aspect ratio"
    }
  },
  required: ["src"],
};

export default schema;
