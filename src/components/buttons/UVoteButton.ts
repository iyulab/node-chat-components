import { UVoteButton } from './UVoteButton.component.js';

UVoteButton.define('u-vote-button');

declare global {
  interface HTMLElementTagNameMap {
    'u-vote-button': UVoteButton;
  }
}

export { UVoteButton };
export type { VoteValue } from './UVoteButton.component.js';
