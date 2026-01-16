# Changelog

## 0.2.0 (2026-01-16)

### Added
- New components: `UPrompt`, `UDotLoader` for enhanced chat UI
- Reference components: `URefCard`, `URefCardGroup`, `URefTag` for displaying references
- New button components: `UReportButton`, `URetryButton`, `UShareButton`, `UVoteButton`
- `UCancelEvent` to replace `UStopEvent`
- Type definitions: `BlockItem`, `BlockReference`, `JsonNode`
- Utility converters for data transformation
- Test utilities: generator.ts, messages.ts

### Changed
- Renamed UJsonViewer to UJsonBlock for consistency
- Enhanced styling and functionality across multiple block components
- Updated button components styling and behavior (UAttachButton, UCopyButton)
- Improved UMessage component structure and styling

### Removed
- Deprecated buttons: USendButton, UThinkButton
- UStopEvent (replaced by UCancelEvent)
- UMessage.types.ts (types moved to dedicated types directory)
- Internal date-helpers utility

## 0.1.1 (2025-12-19)
- Update package.json exports field with correct paths

## 0.1.0 (2025-12-19)
- Initial library version release
