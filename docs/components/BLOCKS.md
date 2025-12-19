# Block Components

## u-code-block

코드를 syntax highlighting과 함께 표시합니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `language` | `string` | `'plaintext'` | 코드 언어 |
| `value` | `string` | - | 코드 내용 |
| `headless` | `boolean` | `false` | 헤더 숨김 여부 |

```html
<u-code-block language="typescript" value="const x = 1;"></u-code-block>
```

---

## u-marked-block

마크다운을 HTML로 렌더링합니다. GFM, KaTeX 수식, Alert를 지원합니다.

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | 마크다운 내용 |

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

AI 도구 호출의 입출력을 표시합니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `status` | `ToolBlockStatus` | `'pending'` | 상태 |
| `name` | `string` | - | 도구 이름 |
| `input` | `string` | - | 입력 JSON |
| `output` | `string` | - | 출력 JSON |
| `collapsed` | `boolean` | `true` | 접힘 상태 |

**ToolBlockStatus**: `'pending'` | `'paused'` | `'inProgress'` | `'success'` | `'failure'`

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `tool-approval` | `{ index, isApproved }` | paused 상태에서 승인/거부 시 |

```html
<u-tool-block 
  status="success" 
  name="get_weather" 
  input='{"city":"Seoul"}' 
  output='{"temp":15}'
></u-tool-block>
```
