import { BaseElement } from "@iyulab/components/dist/components/BaseElement.js";
import { UImagesWidget } from "../components/widgets/UImagesWidget.component.js";
import { UVideoWidget } from "../components/widgets/UVideoWidget.component.js";
import { UQuestionsWidget } from "../components/widgets/UQuestionsWidget.component.js";
import { UMapWidget } from "../components/widgets/UMapWidget.component.js";
import { UChartWidget } from "../components/widgets/UChartWidget.component.js";

/**
 * 위젯 HTML 어트리뷰트 매핑 설정
 */
export interface AttrMapping {
  /** HTML 어트리뷰트 이름 (생략 시 프로퍼티 키 그대로 사용) */
  attr?: string;
  /** true이면 JSON.stringify 후 싱글쿼트로 감싸기 */
  json?: boolean;
}

/**
 * 위젯 정의
 */
export interface WidgetDefinition {
  /** 위젯 식별자 */
  name: string;
  /** LLM용 설명 */
  description: string;
  /** LLM용 예시 JSON */
  example: object;
  /** 등록할 커스텀 엘리먼트 태그명 */
  tag: string;
  /** 등록할 커스텀 엘리먼트 클래스 */
  element: CustomElementConstructor | typeof BaseElement;
  /** 렌더링용 속성 매핑 */
  attrs: Record<string, AttrMapping>;
}

/**
 * 프리셋 위젯 비트 플래그
 */
export enum PresetWidget {
  Images   = 1 << 0,
  Video    = 1 << 1,
  Question = 1 << 2,
  Map      = 1 << 3,
  Chart    = 1 << 4,
  All      = Images | Video | Question | Map | Chart
}

/** 개별 위젯 플래그 목록 */
export const PRESET_WIDGET_LIST = [
  PresetWidget.Images, 
  PresetWidget.Video, 
  PresetWidget.Question, 
  PresetWidget.Map, 
  PresetWidget.Chart
] as const;

/** 프리셋 위젯 정의 */
export const PRESET_DEFINITIONS = new Map<PresetWidget, WidgetDefinition>([
  [
    PresetWidget.Images, 
    {
      name: 'images',
      description: 'Display multiple images in a scrollable gallery or grid layout',
      example: {
        type: 'images',
        items: [
          { src: 'https://picsum.photos/400/300?random=1', alt: 'Sample Image 1', caption: 'Beautiful landscape' },
          { src: 'https://picsum.photos/400/300?random=2', alt: 'Sample Image 2', caption: 'City view' }
        ]
      },
      tag: 'u-images-widget',
      element: UImagesWidget,
      attrs: { items: { json: true } },
    }
  ],
  [
    PresetWidget.Video, 
    {
      name: 'video',
      description: 'Embed video from YouTube, Vimeo, or direct video files',
      example: {
        type: 'video',
        src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        poster: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        ratio: '16:9'
      },
      tag: 'u-video-widget',
      element: UVideoWidget,
      attrs: { src: {}, poster: {}, ratio: {} },
    }
  ],
  [
    PresetWidget.Question, 
    {
      name: 'question',
      description: 'Display suggested questions or queries that users can click to ask',
      example: {
        type: 'question',
        questions: [
          'What is the weather like today?',
          'Tell me a joke',
          'How do I reset my password?'
        ]
      },
      tag: 'u-questions-widget',
      element: UQuestionsWidget,
      attrs: { questions: { json: true } },
    }
  ],
  [
    PresetWidget.Map, 
    {
      name: 'map',
      description: 'Display a map showing a single location',
      example: {
        type: 'map',
        lat: 37.5665,
        lng: 126.9780,
        zoom: 15,
        title: 'Seoul',
        description: 'Capital of South Korea'
      },
      tag: 'u-map-widget',
      element: UMapWidget,
      attrs: { lat: {}, lng: {}, zoom: {}, title: { attr: 'label' }, description: {} },
    }
  ],
  [
    PresetWidget.Chart, 
    {
      name: 'chart',
      description: 'Display charts using Chart.js v4 format. Use standard Chart.js configuration (chartType, data, options). The widget accepts the exact same structure as Chart.js - no conversion needed.',
      example: {
        type: 'chart',
        chartType: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Sales 2024',
            data: [12, 19, 15, 25, 22, 30],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: 'Monthly Sales Report' },
            legend: { display: true, position: 'top' }
          },
          scales: { y: { beginAtZero: true } }
        }
      },
      tag: 'u-chart-widget',
      element: UChartWidget,
      attrs: { chartType: { attr: 'type' }, data: { json: true }, options: { json: true } },
    }
  ]
]);
