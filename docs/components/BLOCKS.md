# Block Components

## u-code-block

코드를 syntax highlighting과 함께 표시합니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `lang` | `string` | `'plaintext'` | 코드 언어 |
| `value` | `string` | - | 코드 내용 |
| `headless` | `boolean` | `false` | 헤더 숨김 여부 |

```html
<u-code-block lang="typescript" value="const x = 1;"></u-code-block>
```

---

## u-json-block

JSON 데이터를 트리 형태로 시각화합니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `JsonNode` | `{}` | JSON 데이터 |
| `expanded` | `boolean` | `true` | 초기 확장 상태 |

```html
<u-json-block .value=${{ name: "John", age: 30 }}></u-json-block>
```

---

## u-marked-block

마크다운을 HTML로 렌더링합니다. GFM, KaTeX 수식을 지원합니다.

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | 마크다운 내용 |
| `refs` | `TextBlockReference[]` | 마크다운 내 인용 출처들 |

```html
<u-marked-block value="# Title\n**bold** text"></u-marked-block>
```

---

## u-text-block

텍스트를 표시하거나 편집합니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | - | 텍스트 내용 |
| `editable` | `boolean` | `false` | 편집 가능 여부 |
| `spellcheck` | `boolean` | `false` | 스펠체크 여부 |
| `placeholder` | `string` | - | 플레이스홀더 |
| `minRows` | `number` | `1` | 최소 행 수 |
| `maxRows` | `number` | - | 최대 행 수 |

```html
<u-text-block editable placeholder="입력하세요" minRows="3"></u-text-block>
```

---

## u-think-block

AI의 추론 과정을 표시합니다. 접기/펼치기를 지원합니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `string` | - | 추론 내용 |
| `loading` | `boolean` | `false` | 로딩 상태 |
| `collapsed` | `boolean` | `true` | 접힘 상태 |

```html
<u-think-block value="분석 중입니다..." loading></u-think-block>
```

---

## u-tool-block

도구 호출의 입출력을 JSON 트리 형태로 표시합니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `loading` | `boolean` | `false` | 로딩 상태 |
| `collapsed` | `boolean` | `true` | 접힘 상태 |
| `heading` | `string` | `'Tool Usage'` | 헤딩 텍스트 |
| `input` | `JsonNode` | - | 입력 데이터 (JSON) |
| `output` | `JsonNode` | - | 출력 데이터 (JSON) |

```html
<u-tool-block 
  heading="get_weather" 
  .input=${{ city: "Seoul" }}
  .output=${{ temp: 15 }}
></u-tool-block>
```
