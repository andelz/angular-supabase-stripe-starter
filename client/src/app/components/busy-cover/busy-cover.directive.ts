import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  Input,
  Optional,
} from "@angular/core";
import { BusyCoverOptions } from "./busy-cover.interface";
import { DOCUMENT } from "@angular/common";

interface BusyCoverValues {
  inert: string | null;
  filter: string | null;
  opacity: string | null;
}

@Directive({
  selector: "[busyCover]",
  standalone: true,
})
export class BusyCoverDirective implements AfterViewInit {
  private elRef = inject(ElementRef);
  private document = inject(DOCUMENT);
  private _svgEl?: SVGElement;
  private _busy: boolean = false;
  private _spinnerSVG =`
  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <style>.spinner_nOfF{animation:spinner_qtyZ 2s cubic-bezier(0.36,.6,.31,1) infinite}.spinner_fVhf{animation-delay:-.5s}.spinner_piVe{animation-delay:-1s}.spinner_MSNs{animation-delay:-1.5s}@keyframes spinner_qtyZ{0%{r:0}25%{r:3px;cx:4px}50%{r:3px;cx:12px}75%{r:3px;cx:20px}100%{r:0;cx:20px}}</style>
    <circle fill="currentColor" class="spinner_nOfF" cx="4" cy="12" r="3"/>
    <circle fill="currentColor" class="spinner_nOfF spinner_fVhf" cx="4" cy="12" r="3"/>
    <circle fill="currentColor" class="spinner_nOfF spinner_piVe" cx="4" cy="12" r="3"/>
    <circle fill="currentColor" class="spinner_nOfF spinner_MSNs" cx="4" cy="12" r="3"/>
  </svg>`;

  // The boolean expression to evaluate as the condition for showing the busy cover
  @Input()
  set busyCover(b: boolean) {
    this._busy = b;
    if (this._initialProps) {
      this._set(
        this._busy ? this._targetProps : this._initialProps,
        this._busy,
      );
    }
  }

  private _defaultCoverOptions: BusyCoverOptions = {
    size: 24,
  }
  @Input()
  busyCoverOptions?: BusyCoverOptions;

  private _initialProps?: BusyCoverValues;
  private _targetProps: BusyCoverValues = {
    inert: "true",
    filter: "blur(5px)",
    opacity: '.7'
  };

  private _set(props: BusyCoverValues, addSpinner: boolean = false) {
    const el = this.elRef.nativeElement as HTMLElement;
    if (props.inert) el.setAttribute("inert", props.inert);
    else el.removeAttribute("inert");
    el.style.setProperty("filter", props.filter || null);

    // add spinner element
    if (addSpinner) {
      // get bounds of host element to globally position the spinner
      const rect: DOMRect = el.getBoundingClientRect();
      this._svgEl = this._createSvgElement();
      const co = {...this._defaultCoverOptions ,...this.busyCoverOptions || {}}
      // position the spinner
      this._svgEl.style.position = 'absolute';
      this._svgEl.style.left = `${rect.left + rect.width / 2 - co.size! / 2}px`;
      this._svgEl.style.top = `${rect.top + rect.height / 2 - co.size! / 2}px`;

      this.document.documentElement.appendChild(this._svgEl);
    } else if(this._svgEl) {
      this.document.documentElement.removeChild(this._svgEl)
    }
  }

  private _createSvgElement(): SVGElement {
    const div = this.document.createElement("DIV");
    div.innerHTML = this._spinnerSVG;
    const svg = div.querySelector("svg");
    return (
      svg || this.document.createElementNS("http://www.w3.org/2000/svg", "path")
    );
  }

  ngAfterViewInit(): void {
    const el = this.elRef.nativeElement as HTMLElement;
    el.style.setProperty("transition", "filter 500ms");
    this._initialProps = {
      inert: el.getAttribute("inert"),
      filter: el.style.filter,
      opacity: el.style.opacity
    };
    if (this._busy) this._set(this._targetProps, true);
  }
}
