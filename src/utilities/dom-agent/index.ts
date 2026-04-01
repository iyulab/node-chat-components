/**
 * DOM Interaction Module
 * LLM이 웹 페이지를 스캔하고 인터랙션할 수 있게 하는 유틸리티
 */

// 핵심 클래스 export
export { DOMScanner } from './DOMScanner.js';
export { DOMController } from './DOMController.js';
export { DOMAgent } from './DOMAgent.js';
export { DOMPromptBuilder } from './DOMPromptBuilder.js';

// 타입 export
export type {
  ElementType,
  ScannedElement,
  ScanResult,
  FilterStrategy,
  ScanOptions,
  DOMAction,
  DOMCommand,
  ExecutionResult,
  DOMAgentEvents,
  AutomationOptions,
  HistoryItem,
  LLMCallback
} from './types.js';
