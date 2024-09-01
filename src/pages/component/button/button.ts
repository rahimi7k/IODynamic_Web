import "./button.scss";
import { StringUtils } from '../../../core/Utils/StringUtils';
import { Component } from '../Component';
import { Color } from '../../ui/Color';
import { UI } from "../../ui/UI";


export class Button extends Component {

	private imgElement: HTMLElement;
	private textElement: HTMLElement;
	private loadContainerElement: HTMLElement;

	private delegate: (e: any) => void;
	public isVisible: boolean = true;
	private locked: boolean = false;
	private disabled: boolean = false;
	private text: string;


	constructor(parentElement: HTMLElement, isStatic: boolean = true, text: string = null) {
		super(parentElement, null, null, isStatic, Component.HTML_TYPE_BUTTON);
		this.text = text;
	}


	override onCreate(): void {
		super.onCreate();
	}


	override onViewInit(): void {
		super.onViewInit();

		this.element.classList.add("button-component");

		(this.element as HTMLButtonElement).type = "button";
		this.element.addEventListener("click", this.onClick);

		//<span> is very much like a <div> element, but <div> is a block-level element whereas a <span> is an inline element
		this.textElement = document.createElement("span");
		if (!StringUtils.isEmpty(this.element.dataset.text)) {
			this.textElement.innerText = this.element.dataset.text;
		} else if (!StringUtils.isEmpty(this.text)) {
			this.textElement.innerText = this.text;
		}

		this.element.appendChild(this.textElement);

		if (!StringUtils.isEmpty(this.element.dataset.imageSrc)) {
			this.imgElement = document.createElement("img");
			(<HTMLImageElement>this.imgElement).src = this.element.dataset.imageSrc;
			(<HTMLImageElement>this.imgElement).alt = "";
			this.imgElement.classList.add("img");
			this.element.insertBefore(this.imgElement, this.textElement);

		} else if (!StringUtils.isEmpty(this.element.dataset.imageInnerHtml)) {
			this.imgElement = document.createElement("div");
			this.imgElement.innerHTML = this.element.dataset.imageInnerHtml;
			this.imgElement.className = "img imgInnerHTML";
			this.element.insertBefore(this.imgElement, this.textElement);
		}


		this.loadContainerElement = document.createElement("div");
		this.loadContainerElement.classList.add("load-container");


		const loadElement = document.createElement("div");
		loadElement.classList.add("load");
		loadElement.innerHTML = UI.getSVGLoader("fefefe");
		this.loadContainerElement.appendChild(loadElement);

		this.element.appendChild(this.loadContainerElement);

		/*const loadImg: HTMLImageElement = document.createElement("img");
		loadImg.src = "/assets/svg/load.svg";
		loadImg.alt = "Load";
		this.loadContainerElement.appendChild(loadImg);
		*/

		this.isOnViewCalled = true;
	}

	override onDestroy(): void {
		super.onDestroy();

		this.element.removeEventListener("click", this.onClick);
	}



	public getElement(): HTMLButtonElement {
		return this.element as HTMLButtonElement;
	}



	public onClick: (e: any) => void = (e: any): void => {
		if (this.delegate != null) {
			this.delegate(e);
		}
	}


	public addOnClickListener(delegate: (e: any) => void): void {
		this.delegate = delegate;
	}


	public get disable(): boolean {
		return this.disabled;
	}

	public set disable(isDisable: boolean) {
		this.disabled = isDisable;

		if (this.disabled) {
			this.element.setAttribute("disabled", "true");
			this.element.style.cursor = "not-allowed";
			this.element.style.opacity = "0.7";
		} else {
			this.element.removeAttribute("disabled");
			this.element.style.cursor = "pointer";
			this.element.style.removeProperty("opacity");
		}
	}


	public get lock(): boolean {
		return this.locked;
	}

	public set lock(isLock: boolean) {
		this.locked = isLock;

		(async (): Promise<void> => {
			await this.isUIReady();
			if (this.locked) {
				this.textElement.style.display = "none";

				if (this.loadContainerElement != null) {
					this.loadContainerElement.style.display = "inline-block";
				}

				if (this.imgElement != null) {
					this.imgElement.style.display = "none";
				}

				this.disable = true;


			} else {
				this.textElement.style.display = "inline";

				if (this.loadContainerElement != null) {
					this.loadContainerElement.style.display = "none";
				}

				if (this.imgElement != null) {
					this.imgElement.style.display = "inline-block";
				}

				this.disable = false;
			}
		})();

	}


	public setColor(color: Color.Color): void;
	public setColor(color: string): void;
	public setColor(color: Color.Color | string): void {
		this.element.style.backgroundColor = color;
		//this.element.style.webkitFilter = "drop-shadow(0px 0px 1px " + Color.changeColor(color, -40) + ")";//"-webkit-filter"
		//this.element.style.filter = "drop-shadow(0px 0px 1px " + Color.changeColor(color, -40) + ")";
		//var borderColor: any = Color.hexToRgb(color);
		this.element.style.border = "solid 1px " + Color.changeColor(color, -40);
	}

	public setDisable(bool: boolean): void {
		if (bool) {
			this.element.setAttribute("disabled", "true");
		} else {
			this.element.removeAttribute("disabled");
		}
	}


	public setText(text: string) {
		(async () => {
			await this.isUIReady();
			this.textElement.innerText = text;
		})();
	}


}