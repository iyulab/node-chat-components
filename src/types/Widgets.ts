import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UImagesWidget } from "../components/widgets/UImagesWidget.component.js";
import { UVideoWidget } from "../components/widgets/UVideoWidget.component.js";
import { UMapWidget } from "../components/widgets/UMapWidget.component.js";
import { UChartWidget } from "../components/widgets/UChartWidget.component.js";
import { type JsonSchema } from "./JsonSchema.js";

/**
 * widget-json 코드블록에서 파싱된 위젯 데이터 구조
 */
export interface WidgetSchema {
  /** 위젯 태그명 */
  tag: string;
  /** 위젯 속성 */
  properties?: Record<string, unknown>;
}

/**
 * 위젯을 정의하는 구조체
 */
export interface WidgetDefinition {
  /** 위젯 식별자 */
  name: string;
  /** 등록할 커스텀 엘리먼트 태그명 */
  tag: string;
  /** 등록할 커스텀 엘리먼트 클래스 */
  element: CustomElementConstructor | typeof BaseElement;
  /** LLM용 설명 */
  description: string;
  /** LLM용 속성 스키마 */
  properties?: Record<string, JsonSchema>;
  /** 필수 속성 목록 */
  required?: string[];
}

/**
 * 프리셋 위젯 비트 플래그
 */
export enum PresetWidget {
  Images   = 1 << 0,
  Video    = 1 << 1,
  Map      = 1 << 3,
  Chart    = 1 << 4,
  All      = Images | Video | Map | Chart
}

/** 
 * 전체 프리셋 위젯 플래그 목록 
 */
export const PRESET_WIDGET_LIST = [
  PresetWidget.Images, 
  PresetWidget.Video, 
  PresetWidget.Map, 
  PresetWidget.Chart
] as const;

/** 
 * 프리셋 위젯 정의 
 */
export const PRESET_DEFINITIONS = new Map<PresetWidget, WidgetDefinition>([
  [
    PresetWidget.Images, 
    {
      name: 'images',
      tag: 'u-images-widget',
      element: UImagesWidget,
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
    PresetWidget.Video, 
    {
      name: 'video',
      tag: 'u-video-widget',
      element: UVideoWidget,
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
    PresetWidget.Map, 
    {
      name: 'map',
      tag: 'u-map-widget',
      element: UMapWidget,
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
    PresetWidget.Chart, 
    {
      name: 'chart',
      tag: 'u-chart-widget',
      element: UChartWidget,
      description: 'Display charts using Chart.js v4 format. Use standard Chart.js configuration (type, data, options). The widget accepts the exact same structure as Chart.js - no conversion needed.',
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
