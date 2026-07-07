import { type JsonSchema } from "./JsonSchema.js";

/**
 * Extra(부가 렌더링 블록)를 정의하는 구조체
 */
export interface ExtraDefinition {
  /** 등록할 커스텀 엘리먼트 태그명 */
  tag: string;
  /** LLM용 설명 */
  description: string;
  /** LLM용 속성 스키마 */
  properties?: Record<string, JsonSchema>;
  /** 필수 속성 목록 */
  required?: string[];
}

/**
 * 프리셋 Extra 비트 플래그
 */
export enum PresetExtra {
  Images   = 1 << 0,
  Video    = 1 << 1,
  Map      = 1 << 3,
  Chart    = 1 << 4,
  All      = Images | Video | Map | Chart
}

/**
 * 전체 프리셋 Extra 플래그 목록
 */
export const PRESET_EXTRA_LIST = [
  PresetExtra.Images,
  PresetExtra.Video,
  PresetExtra.Map,
  PresetExtra.Chart
] as const;

/**
 * 프리셋 Extra 정의
 * 컴포넌트 클래스를 import하지 않습니다 — `@iyulab/chat-components/extras`를 import해야
 * 실제 커스텀 엘리먼트(u-images-block 등)가 등록되며, 여기 정의는 프롬프트 스키마 용도로만 쓰입니다.
 */
export const PRESET_EXTRA_DEFINITIONS = new Map<PresetExtra, ExtraDefinition>([
  [
    PresetExtra.Images,
    {
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
    }
  ],
  [
    PresetExtra.Video,
    {
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
    }
  ],
  [
    PresetExtra.Map,
    {
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
    }
  ],
  [
    PresetExtra.Chart,
    {
      tag: 'u-chart-block',
      description: 'Display charts using Chart.js v4 format. Use standard Chart.js configuration (type, data, options). The block accepts the exact same structure as Chart.js - no conversion needed.',
      properties: {
        type: {
          type: "string",
          enum: ["bar", "line", "pie", "doughnut", "radar", "polarArea", "bubble", "scatter"],
          description: "Chart.js chart type"
        },
        data: {
          type: "object",
          description: "Chart.js data configuration",
          additionalProperties: true
        },
        options: {
          type: "object",
          description: "Chart.js options configuration (optional)",
          additionalProperties: true
        }
      },
      required: ["type", "data"],
    }
  ]
]);
