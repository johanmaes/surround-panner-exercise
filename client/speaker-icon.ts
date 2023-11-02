import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

@customElement("speaker-icon")
export class SpeakerIcon extends LitElement {
  @property({ type: Number })
  angle: number = 0;

  @query(".container")
  container?: HTMLDivElement;

  render() {
    return html`
      <form class="container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      </form>
    `;
  }

  protected firstUpdated() {
    if (this.container)
      this.container.style.transform = `rotate(${this.angle + 90}deg)`;
  }

  static styles = css`
    .container {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
      color: white;
    }

    svg {
      width: 10%;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "speaker-icon": SpeakerIcon;
  }
}
