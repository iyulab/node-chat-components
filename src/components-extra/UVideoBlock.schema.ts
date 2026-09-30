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
    },
    tracks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          src: { type: "string", description: "WebVTT file URL" },
          kind: { type: "string", enum: ["subtitles", "captions", "descriptions", "chapters", "metadata"], default: "subtitles", description: "Track kind" },
          srclang: { type: "string", description: "Language of the track text (BCP 47, e.g. ko)" },
          label: { type: "string", description: "Name shown in the player's track menu" },
          default: { type: "boolean", description: "Show this track by default" }
        },
        required: ["src"]
      },
      description: "Subtitle / caption tracks for a direct video file (ignored for YouTube and Vimeo)"
    }
  },
  required: ["src"],
};

export default schema;
