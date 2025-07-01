export type JsonValue = string | number | boolean | null;

export type JsonObject = { [x: string]: JsonNode };

export type JsonArray = Array<JsonNode>;

export type JsonNode = JsonValue | JsonObject | JsonArray;
