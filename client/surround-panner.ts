import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("surround-panner")
export class SurroundPanner extends LitElement {
  @property({ type: Number })
  x = 195;

  @property({ type: Number })
  y = 195;

  @property({ type: Boolean })
  on = false;

  @property({ type: Object })
  response = {
    l: 0,
    r: 0,
    c: 0,
    ls: 0,
    rs: 0,
  };

  render() {
    return html`
      <div>
        <div class="canvas">
          <div @mousemove=${this.handleMouse} class="canvas-inner"></div>
          <button
            @click=${this.toggle}
            @keydown=${this.handleKey}
            class="dot"
            style="top: ${this.y - 5}px; left: ${this.x - 5}px"></button>
        </div>
        <ul>
          ${Object.entries(this.response).map(
            ([key, value]) => html`<li>${key}: ${value}</li>`
          )}
        </ul>
      </div>
    `;
  }

  private async send() {
    const res = await fetch(
      `http://localhost:5174/api?x=${this.x}&y=${this.y}`,
      {
        method: "GET",
      }
    );
    this.response = await res.json();
  }

  private toggle(e) {
    this.on = !this.on;
  }

  private handleMouse(e: { layerX: number; layerY: number }) {
    if (this.on) {
      this.x = e.layerX;
      this.y = e.layerY;
      this.send();
    }
  }

  private handleKey(e: { shiftKey: boolean; key: string }) {
    this.on = false;
    let step = 1;
    if (e.shiftKey) step = 10;
    switch (e.key) {
      case "l":
      case "ArrowRight":
        this.x += step;
        break;
      case "h":
      case "ArrowLeft":
        this.x -= step;
        break;
      case "j":
      case "ArrowDown":
        this.y += step;
        break;
      case "k":
      case "ArrowUp":
        this.y -= step;
        break;
    }
    this.send();
  }

  static styles = css`
    .canvas {
      width: 400px;
      height: 400px;
      margin: 0 auto;
      border-radius: 50%;
      position: relative;
    }

    .canvas-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #ccc;
    }

    .dot {
      position: absolute;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #000;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "surround-panner": SurroundPanner;
  }
}
