/** JSON 값 타입 */
export type JsonValue = string | number | boolean | null;

/** JSON 객체 타입 */
export type JsonObject = { [x: string]: JsonNode };

/** JSON 배열 타입 */
export type JsonArray = Array<JsonNode>;

/**
 * JSON 데이터 구조에서 사용할 수 있는 모든 유형의 노드를 표현합니다.
 * JsonValue(원시값), JsonObject(객체), JsonArray(배열) 중 하나가 될 수 있습니다.
 * 
 * @example
 * ```typescript
 * const primitiveNode: JsonNode = "string value";
 * const objectNode: JsonNode = { key: "value" };
 * const arrayNode: JsonNode = [1, 2, 3];
 * ```
 */
export type JsonNode = JsonValue | JsonObject | JsonArray;
