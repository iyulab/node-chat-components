import { type JsonSchema } from "./JsonSchema.js";
import { UImagesView } from "../components/views/UImagesView.js";
import { UVideoView } from "../components/views/UVideoView.js";
import { UMapView } from "../components/views/UMapView.js";

/**
 * View를 정의하는 구조체
 */
export interface ViewDefinition {
  /** 커스텀 엘리먼트 클래스 (optional: chart처럼 별도 서브패스로 분리된 경우 생략 가능) */
  element?: CustomElementConstructor;
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
 * 프리셋 View 비트 플래그
 */
export enum PresetView {
  Images   = 1 << 0,
  Video    = 1 << 1,
  Map      = 1 << 3,
  Chart    = 1 << 4,
  All      = Images | Video | Map | Chart
}

/** 
 * 전체 프리셋 View 플래그 목록 
 */
export const PRESET_VIEW_LIST = [
  PresetView.Images,
  PresetView.Video,
  PresetView.Map,
  PresetView.Chart
] as const;

/** 
 * 프리셋 View 정의 
 */
export const PRESET_VIEW_DEFINITIONS = new Map<PresetView, ViewDefinition>([
  [
    PresetView.Images,
    {
      element: UImagesView,
      tag: 'u-images-view',
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
    PresetView.Video,
    {
      element: UVideoView,
      tag: 'u-video-view',
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
    PresetView.Map,
    {
      element: UMapView,
      tag: 'u-map-view',
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
    PresetView.Chart,
    {
      tag: 'u-chart-view',
      description: 'Display charts using Chart.js v4 format. Use standard Chart.js configuration (type, data, options). The View accepts the exact same structure as Chart.js - no conversion needed.',
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
