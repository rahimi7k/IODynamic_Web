import "./seekbar.scss";
import { StringUtils } from '../../../core/Utils/StringUtils';
import { Component } from '../Component';
import { Interval } from "../../../core/Utils/Interval";

export class SeekBar extends Component {

	private isStatic: boolean;
	private hasButton: boolean;
	private inputValue: string;
	private minValue: number;
	private maxValue: number;
	private step: number;

	public element: HTMLInputElement;
	private inputElement: HTMLInputElement;

	private onInputChangeDelegate: (value: number) => void;



	/**
	 * 
	 * @param parentElement
	 * @param isStatic
	 * @param hasButton Does seekbar has plus and minus button
	 * @param value Default is 0
	 * @param min Default is 0
	 * @param max Default is 100
	 * @param step Default is 1
	 */
	constructor(parentElement: HTMLElement, isStatic: boolean, hasButton: boolean, value: number = 0, min: number = 0, max: number = 100, step: number = 1) {
		super(parentElement, null, null, isStatic, Component.HTML_TYPE_DIV);

		this.isStatic = isStatic;
		this.hasButton = hasButton;
		this.inputValue = value + "";
		this.minValue = min;
		this.maxValue = max;
		this.step = step;

	}


	override onCreate() {
		super.onCreate();

	}


	override onViewInit(): void {
		super.onViewInit();

		this.element.classList.add("seekbar-component", "disable-drag", "disable-select");

		const containerElement: HTMLElement = document.createElement("div");
		containerElement.classList.add("container");
		this.element.appendChild(containerElement);

		if (this.hasButton) {
			const minusElement: HTMLImageElement = document.createElement("img");
			minusElement.classList.add("btn", "minus", "disable-drag", "disable-select", "clickable");
			minusElement.alt = "minus";
			minusElement.draggable = false;
			minusElement.src = "/assets/svg/minus.svg";
			minusElement.addEventListener("click", () => {
				const newValue: number = StringUtils.parseInt(this.inputElement.value) - 1;
				this.inputElement.value = newValue + "";
				if (this.onInputChangeDelegate != null) {
					this.onInputChangeDelegate(newValue);
				}
			});
			containerElement.appendChild(minusElement);
		}

		this.inputElement = document.createElement("input");
		this.inputElement.classList.add("input");
		this.inputElement.type = "range";
		this.inputElement.step = this.step + "";
		this.inputElement.min = this.minValue + "";
		this.inputElement.max = this.maxValue + "";
		this.inputElement.value = this.inputValue + "";
		this.inputElement.addEventListener("input", () => {
			this.inputValue = this.inputElement.value;

			if (this.onInputChangeDelegate != null) {
				this.onInputChangeDelegate(StringUtils.parseInt(this.inputElement.value));
			}
		});
		containerElement.appendChild(this.inputElement);


		if (this.hasButton) {
			const plusElement: HTMLImageElement = document.createElement("img");
			plusElement.classList.add("btn", "plus", "disable-drag", "disable-select", "clickable");
			plusElement.alt = "plus";
			plusElement.draggable = false;
			plusElement.src = "/assets/svg/plus.svg";
			plusElement.addEventListener("click", () => {
				const newValue: number = StringUtils.parseInt(this.inputElement.value) + 1;
				this.inputElement.value = newValue + "";
				if (this.onInputChangeDelegate != null) {
					this.onInputChangeDelegate(newValue);
				}
			});
			containerElement.appendChild(plusElement);
		}


		this.isStatic = null;
		this.hasButton = null;
		this.inputValue = null;
		this.minValue = null;
		this.maxValue = null;
		this.step = null;
		this.isOnViewCalled = true;
	}


	override onDestroy(): void {
		super.onDestroy();

	}




	public show(): void {
		this.element.style.visibility = "inherit";
		this.element.style.position = "static";
	}



	/**
	* Set onInputChange Delegate
	* @param onInputChangeDelegate The parameter value is the new input value
	*/
	public onInputChange(onInputChangeDelegate: (value: number) => void): void {
		this.onInputChangeDelegate = onInputChangeDelegate;
	}



	public get value(): number {
		return StringUtils.parseInt(this.inputElement.value);
	}

	public set value(value: number) {
		(async (): Promise<void> => {
			await this.isUIReady();
			this.inputElement.value = value + "";
		})();
	}


	public get min(): number {
		return StringUtils.parseInt(this.inputElement.min);
	}

	public set min(value: number) {
		(async (): Promise<void> => {
			await this.isUIReady();
			this.inputElement.min = value + "";
		})();
	}


	public get max(): number {
		return StringUtils.parseInt(this.inputElement.max);
	}

	public set max(value: number) {
		(async (): Promise<void> => {
			await this.isUIReady();
			this.inputElement.max = value + "";
		})();
	}


}