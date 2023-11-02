import { LitElement, css, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import "./speaker-icon";

@customElement("surround-panner")
export class SurroundPanner extends LitElement {
  @property({ type: String })
  public title: string = "Surround panner";

  /**
   * The x position of the listener
   */
  @state()
  protected x: number = 0;

  /**
   * The y position of the listener
   */
  @state()
  protected y: number = 0;

  /**
   * The radius of the circle
   */
  @state()
  protected r: number = 0;

  /**
   * Toggle draggable state
   */
  @state()
  protected on: boolean = false;

  /**
   * The api response
   */
  @state()
  response: Record<string, number> = {
    x: 0,
    y: 0,
    l: 0,
    r: 0,
    c: 0,
    ls: 0,
    rs: 0,
  };

  /**
   * The circle in which the listener can be moved
   */
  @query(".canvas__wrapper")
  canvas?: HTMLDivElement;

  /**
   * The dot, representing the position of the listener
   */
  @query(".surround-panner__listener")
  listener?: HTMLButtonElement;

  render() {
    return html`
      <div class="surround-panner">
        <div class="surround-panner__title">${this.title}</div>

        <hr />
        <div class="surround-panner__canvas">
          <div class="canvas__wrapper">
            ${[-110, -30, 0, 30, 110].map(
              (angle) => html`<speaker-icon angle=${angle}></speaker-icon>`
            )}
            <div @mousemove=${this.handleMouse} class="canvas__inner"></div>
            <button
              @click=${this.toggle}
              @keydown=${this.handleKey}
              class="surround-panner__listener"
              style="top: ${this.y}px; left: ${this.x}px"></button>
          </div>
        </div>

        <hr />
        <div class="surround-panner__footer">
          <div class="surround-panner__result">
            <ul class="surround-panner__list surround-panner__list--req">
              ${Object.entries(this.response)
                .filter(([key]) => ["x", "y"].includes(key))
                .map(
                  ([key, value]) =>
                    html`<li class="surround-panner__list__item">
                      <div class="surround-panner__list__item--key">${key}</div>
                      <div class="surround-panner__list__item--value">
                        ${Math.round(value * 100) / 100}
                      </div>
                    </li> `
                )}
            </ul>
            <div class="surround-panner__reset">
              <button @click=${this.reCenter}>Reset</button>
            </div>
          </div>

          <hr />
          <div class="surround-panner__result">
            <ul class="surround-panner__list surround-panner__list--res">
              ${Object.entries(this.response)
                .filter(([key]) => !["x", "y"].includes(key))
                .map(
                  ([key, value]) =>
                    html`<li class="surround-panner__list__item">
                        <div class="surround-panner__list__item--key">
                          ${key}
                        </div>
                        <div class="surround-panner__list__item--value">
                          ${Math.round(value * 100) / 100}
                        </div>
                        <div class="surround-panner__list__item--dB">dB</div>
                      </li>
                      <hr />`
                )}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Send the result to the backend
   */
  private async send() {
    const r = this.getCurrentRadius();
    const x = (r - this.x) / r;
    const y = (r - this.y) / r;
    const res = await fetch(`http://localhost:5174/api?x=${-x}&y=${y}`, {
      method: "GET",
    });
    this.response = await res.json();
  }

  /**
   * Lock/unlock the position by clicking on the dot
   */
  private toggle() {
    this.on = !this.on;
    if (!this.listener) return;
    this.listener.style.cursor = this.on ? "move" : "pointer";
  }

  /**
   * When moving with the mouse
   */
  private handleMouse(e: { layerX: number; layerY: number }) {
    if (this.on) {
      this.x = e.layerX;
      this.y = e.layerY;
      this.send();
    }
  }

  /**
   * When moving with keyboard navigation
   */
  private handleKey(e: KeyboardEvent) {
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

  /**
   * Get the current radius of the canvas.
   */
  private getCurrentRadius() {
    return (this.canvas?.getBoundingClientRect().width || 100) / 2;
  }

  private reCenter() {
    this.r = this.getCurrentRadius();
    this.x = this.r;
    this.y = this.r;
    this.send();
  }

  /**
   * When mounted, measure the radius and
   * place the listener in the center
   */
  firstUpdated() {
    this.reCenter();
  }

  connectedCallback(): void {
    super.connectedCallback();
    window?.addEventListener("resize", (_uiEvent: UIEvent) => {
      /**
       * Remeasure the radius and update
       * the listener position
       */
      const r = this.getCurrentRadius();
      const diff = r / this.r;
      this.x = this.x * diff;
      this.y = this.y * diff;
      this.r = r;
    });
  }

  static styles = css`
    .surround-panner {
      --font-family: var(--surround-panner-font-family, "Verdana");
      --color-primary: var(--surround-panner-color-primary, #1d1d1d);
      --color-secondary: var(--surround-panner-color-secondary, #fff);
      --color-tertiary: var(
        --surround-panner-color-tertiary,
        var(--color-secondary)
      );
      --color-white: var(--surround-panner-color-white, #fff);
      --color-grey: var(--surround-panner-color-grey, #ccc);
      --color-grey-light: var(--surround-panner-color-grey-light, #fafafa);
      --color-dark: var(--surround-panner-color-dark, #1d1d1d);
      --space-sm: var(--surround-panner-space-sm, 4px);
      --space-md: var(--surround-panner-space-md, 8px);
      --space-lg: var(--surround-panner-space-lg, 16px);
      --space-xl: var(--surround-panner-space-xl, 32px);
      --radius: var(--surround-panner-radius, --space-md);
      width: 100%;
      min-width: 200px;
      max-width: 500px;
      border: 1px solid var(--color-grey);
      border-radius: var(--radius);
      font-family: var(--font-family);
      color: var(--color-dark);
      background-color: var(--color-tertiary);
    }

    .surround-panner__footer {
      background-color: var(--color-grey-light);
      border-radius: 0 0 var(--radius) var(--radius);
    }

    .surround-panner__result {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .surround-panner__list {
      list-style: none;
      padding-left: 0;
      margin: var(--space-lg);
      width: 100%;
    }

    .surround-panner__list--req {
      max-width: 100px;
    }

    .surround-panner__list__item {
      display: flex;
    }

    .surround-panner__list__item--key {
      margin-right: var(--space-md);
    }
    .surround-panner__list__item--value {
      margin-left: auto;
      margin-right: var(--space-md);
      text-align: right;
    }

    .surround-panner__reset {
      margin-left: auto;
      align-self: center;
      margin-right: var(--space-lg);
    }

    hr {
      margin: 0;
      border: none;
      height: 1px;
      background-color: var(--color-grey);
    }

    button {
      border: none;
      background-color: var(--color-primary);
      color: var(--color-white);
      border-radius: var(--radius);
      padding: var(--space-sm) var(--space-lg);
      cursor: pointer;
    }

    .surround-panner__title {
      font-size: var(--space-lg);
      text-align: center;
    }

    .surround-panner__canvas {
      border: 10px solid var(--color-grey);
      border-radius: 50%;
      margin: var(--space-lg);
    }

    .canvas__wrapper {
      margin: 0 auto;
      position: relative;
      aspect-ratio: 1 / 1;
      background-color: var(--color-grey);
      border-radius: 50%;
    }

    .canvas__inner {
      width: 100%;
      height: 100%;
      border: 1px solid var(--color-grey);
      position: relative;
      border-radius: 50%;
      box-sizing: border-box;
    }

    .surround-panner__listener {
      border-radius: 50%;
      position: absolute;
      background-color: var(--color-primary);
      border: none;
      width: 5%;
      height: 5%;
      padding: 0;
      margin: 0;
      cursor: pointer;
      transform: translate(-50%, -50%);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "surround-panner": SurroundPanner;
  }
}
