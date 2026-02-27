- `actions` 기능 추가
  - `actions`는 dom 요소를 직접 조작할 수 있는 기능입니다.
	- `actions`는 json 형태로 정의되며, llm이 json을 반환하면 해당 json을 파싱하여 dom 요소를 조작합니다.
	- 예시:
		```action-json
		{
			"actions": [
				{
					"type": "update",
					"target": "#my-element",
					"content": "Updated content"
				},
				{
					"type": "delete",
					"target": "#old-element"
				}
			]
		}
		```
	- llm에 `actions` 기능을 사용하도록 지시하려면, 범위내의 dom에서 컨트롤 가능한 요소들을 수집하고, llm에게 해당 요소들의 정보를 제공해야 합니다. 예를 들어, `id`, `class`, `tag`, `description` 등의 정보를 포함할 수 있습니다.
	- 요소 수집시 shadowRoot 내부의 요소들도 포함해야 합니다. 이를 위해, 재귀적으로 shadowRoot를 탐색하여 모든 요소를 수집하는 로직이 필요합니다.
	- 수집된 요소 정보는 llm에게 json 형태로 전달되어야 하며, llm은 이를 바탕으로 `actions`를 생성하여 반환할 수 있습니다.
	- `actions` 기능이 구현되면, llm이 반환한 `actions`를 파싱하여 실제로 dom 요소를 업데이트하거나 삭제하는 로직도 필요합니다. 이를 위해, 각 `action`의 `type`에 따라 적절한 조작을 수행하는 함수를 구현해야 합니다.
	- `actions` 기능 수행이후 llm이 다시 응답을 반환할 수 있도록, `actions` 수행이 완료된 후에 llm에게 다시 응답을 요청하는 로직도 필요합니다. 이를 통해, llm이 `actions` 수행 결과를 반영하여 새로운 응답을 생성할 수 있습니다.
	- 이미 수행한 `actions`에 대한 정보를 llm에게 제공하여, llm이 이전에 수행한 `actions`를 인식하고, 중복된 `actions`를 생성하지 않도록 하는 로직도 필요합니다. 이를 위해, 수행된 `actions`의 정보를 저장하고, llm에게 해당 정보를 전달하는 기능이 필요합니다.

- `u-question-widget`을 `action`으로 이동
  - 방법론은 이 아이디어 입니다.
	- 위젯이 아닌 `action`으로 구현하여, user프롬프트쪽으로 가게합니다.
	- 여기서 `action`이 좀더 구체화될 필요가 있습니다. 예를 들어, `action`의 `type`이 `question`인 경우, llm의 프롬프트에서 해당코드블록을 추출하여 llm 프롬프트에서 제거하고, 대신 user메시지로 추가하는 것입니다.
	- 이렇게 하면, llm이 `question` `action`을 반환하면, 해당 `action`을 파싱하여 user메시지로 추가하는 로직이 필요합니다. 이를 위해, `action`의 `content`에 질문 내용을 포함시키고, 해당 내용을 user메시지로 추가하는 함수를 구현해야 합니다.
	- 또한, `question` `action`이 반환된 후에 llm이 다시 응답을 반환할 수 있도록, `question` `action` 수행이 완료된 후에 llm에게 다시 응답을 요청하는 로직도 필요합니다. 이를 통해, llm이 `question` `action` 수행 결과를 반영하여 새로운 응답을 생성할 수 있습니다.

- `widget` 기능에서 생성되는 도중일경우 `skeleton` UI 추가
	- `widget`이 생성되는 동안, 사용자에게 로딩 상태를 보여주기 위해 `skeleton` UI를 추가하는 기능입니다.
	- `widget`이 생성되는 동안, 해당 영역에 `skeleton` UI를 표시하여 사용자가 기다리는 동안 시각적으로 피드백을 받을 수 있도록 합니다.

- `widget` 기능에서 json이 잘못된 경우, 에러 UI 추가
	- `widget` 기능에서 llm이 반환하는 json이 잘못된 경우, 사용자에게 에러 메시지를 보여주는 UI를 추가하는 기능입니다.
	- llm이 반환하는 json이 올바르지 않은 경우, 해당 영역에 에러 메시지를 표시하여 사용자가 문제를 인식할 수 있도록 합니다.
