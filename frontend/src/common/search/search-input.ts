import { mdiClose, mdiMagnify } from "@mdi/js";
import "@polymer/paper-input/paper-input";
import type { PaperInputElement } from "@polymer/paper-input/paper-input";
import {
  css,
  CSSResultGroup,
  html,
  LitElement,
  PropertyValues,
  TemplateResult,
} from "lit";
import { customElement, property, query } from "lit/decorators";
import "../../components/ha-icon-button";
import "../../components/ha-svg-icon";
import { HomeAssistant } from "../../types";
import { fireEvent } from "../dom/fire_event";

@customElement("search-input")
class SearchInput extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property() public filter?: string;

  @property({ type: Boolean, attribute: "no-label-float" })
  public noLabelFloat? = false;

  @property({ type: Boolean, attribute: "no-underline" })
  public noUnderline = false;

  @property({ type: Boolean })
  public autofocus = false;

  @property({ type: String })
  public label?: string;

  public focus() {
    this.shadowRoot!.querySelector("paper-input")!.focus();
  }

  @query("paper-input", true) private _input!: PaperInputElement;

  protected render(): TemplateResult {
    return html`
      <paper-input
        .autofocus=${this.autofocus}
        .label=${this.label || "Search"}
        .value=${this.filter}
        @value-changed=${this._filterInputChanged}
        .noLabelFloat=${this.noLabelFloat}
      >
        <slot name="prefix" slot="prefix">
          <ha-svg-icon class="prefix" .path=${mdiMagnify}></ha-svg-icon>
        </slot>
        ${this.filter &&
        html`
          <ha-icon-button
            slot="suffix"
            @click=${this._clearSearch}
            .label=${this.hass.localize("ui.common.clear")}
            .path=${mdiClose}
          ></ha-icon-button>
        `}
      </paper-input>
    `;
  }

  protected updated(changedProps: PropertyValues) {
    if (
      changedProps.has("noUnderline") &&
      (this.noUnderline || changedProps.get("noUnderline") !== undefined)
    ) {
      (
        this._input.inputElement!.parentElement!.shadowRoot!.querySelector(
          "div.unfocused-line"
        ) as HTMLElement
      ).style.display = this.noUnderline ? "none" : "block";
    }
  }

  private async _filterChanged(value: string) {
    fireEvent(this, "value-changed", { value: String(value) });
  }

  private async _filterInputChanged(e) {
    this._filterChanged(e.target.value);
  }

  private async _clearSearch() {
    this._filterChanged("");
  }

  static get styles(): CSSResultGroup {
    return css`
      ha-svg-icon,
      ha-icon-button {
        color: var(--primary-text-color);
      }
      ha-icon-button {
        --mdc-icon-button-size: 24px;
      }
      ha-svg-icon.prefix {
        margin: 8px;
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "search-input": SearchInput;
  }
}
