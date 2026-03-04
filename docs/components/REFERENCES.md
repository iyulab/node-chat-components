# Reference Components

참조 및 출처를 표시하는 컴포넌트들입니다.

---

## u-ref-card

참조 출처를 카드 형태로 표시합니다.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'web' \| 'document'` | `'web'` | 카드 타입 |
| `url` | `string` | - | 외부 링크 URL |
| `title` | `string` | `''` | 카드 제목 |
| `snippet` | `string` | - | 본문 발췌 내용 |
| `tags` | `string[]` | - | 태그 목록 (JS property) |

```html
<u-ref-card
  type="web"
  url="https://example.com"
  title="Example Website"
  snippet="발췌 내용을 여기에 표시합니다."
  .tags=${['documentation', 'API']}
></u-ref-card>
```

---

## u-ref-card-group

여러 참조 카드를 그룹으로 표시합니다.

```html
<u-ref-card-group>
  <u-ref-card type="web" url="https://example1.com" title="Source 1"></u-ref-card>
  <u-ref-card type="web" url="https://example2.com" title="Source 2"></u-ref-card>
</u-ref-card-group>
```

---

## u-ref-tag

본문 내 인용 참조를 태그 형태로 표시합니다. `u-marked-block`의 `refs` 프로퍼티로 자동 생성되므로 직접 사용할 일은 드뭅니다.

| Property | Type | Description |
|----------|------|-------------|
| `href` | `string` | 참조 링크 URL |

```html
<u-ref-tag href="https://example.com">
  1
  <div slot="tooltip">
    <strong>출처</strong>
    <p>Example Website</p>
  </div>
</u-ref-tag>
```

### Slots
- `default`: 태그 번호나 라벨
- `tooltip`: 툴팁에 표시할 참조 정보
