import "./input.scss";
import { SettingController } from '../../pages/setting/setting.controller';
import { StringUtils } from '../../../core/Utils/StringUtils';
import { Component } from '../Component';
import { Color } from '../../ui/Color';
import { Language } from '../../../core/Language/Language';
import { UI } from "../../ui/UI";
import { Interval } from "../../../core/Utils/Interval";
import { Media } from "../../../core/Utils/Audio";


export class Input extends Component {

	public isDisable: boolean = false;
	private isTextArea: boolean = false;

	private type: string;
	private placeHolder: string;

	private onInputDelegate: (...args: Object[]) => void;
	private onEnterDelegate: (...args: Object[]) => void;

	public element: HTMLInputElement;
	private parentHintElement: HTMLDivElement
	private hintElement: HTMLParagraphElement

	constructor(parentElement: HTMLElement, isStatic: boolean = true, type: string = "text", hasHint: boolean = false, placeHolder: string = null, isTextArea: boolean = false) {
		super(parentElement, null, null, isStatic, isTextArea ? Component.HTML_TYPE_TEXT_AREA : Component.HTML_TYPE_INPUT);
		this.placeHolder = placeHolder;
		this.type = StringUtils.isEmpty(type) ? "text" : type;
		this.isTextArea = isTextArea;

		if (hasHint) {
			this.parentHintElement = document.createElement("div");
			this.parentHintElement.classList.add("input-hint");
			if (isStatic) {
				parentElement.parentElement.appendChild(this.parentHintElement);
			} else {
				parentElement.appendChild(this.parentHintElement);
			}

			this.hintElement = document.createElement("p");
			this.parentHintElement.appendChild(this.hintElement);
		}
	}


	override onCreate(): void {
		super.onCreate();
	}


	override onViewInit(): void {
		super.onViewInit();

		this.element.classList.add("input-component", SettingController.direction);

		if (!this.isTextArea) { //TextArea does not have type
			this.element.type = this.type;
		}

		if (!StringUtils.isEmpty(this.placeHolder)) {
			this.element.placeholder = this.placeHolder;
		}

		this.isOnViewCalled = true;

		this.element.addEventListener("input", this.onInput);

	}

	override onDestroy(): void {
		super.onDestroy();

		this.element.removeEventListener("input", this.onInput);
		this.removeOnEnterListener();
	}


	public disable(isDisable: boolean): void {
		this.isDisable = isDisable;
		if (isDisable) {
			this.element.setAttribute("disabled", "true");
			this.element.classList.add("disabled");
			this.removeHint();
		} else {
			this.element.removeAttribute("disabled");
			this.element.classList.remove("disabled");
		}
	}



	public get value(): string {
		return StringUtils.isEmpty(this.element.value) ? "" : this.element.value;
	}

	public set value(value: string) {
		this.element.value = value;
	}


	public setPlaceHolder(text: string): void {
		this.element.placeholder = text;
	}



	private onEnter: (event: any) => void = (event: any): void => {
		if (this.isDisable || this.onEnterDelegate == null || UI.detectInputKeyboard(event) !== "Enter") {
			return;
		}
		event.preventDefault();
		this.onEnterDelegate();
	}


	private onInput: (event: any) => void = (): void => {
		if (this.isDisable) {
			return;
		}
		this.removeHint();

		if (this.onInputDelegate != null) {
			this.onInputDelegate();
		}
	}

	public addOnInputListener(delegate: (...args: Object[]) => void): void {
		if (delegate != null) {
			this.onInputDelegate = delegate;
		}
	}

	public removeOnInputListener(): void {
		if (this.onInputDelegate != null) {
			this.onInputDelegate = null;
		}
	}

	public addOnEnterListener(delegate: (...args: Object[]) => void): void {
		if (delegate != null) {
			this.element.addEventListener("keyup", this.onEnter);
			this.onEnterDelegate = delegate;
		}
	}

	public removeOnEnterListener(): void {
		if (this.onEnterDelegate != null) {
			this.element.removeEventListener("keyup", this.onEnter);
			this.onEnterDelegate = null;
		}
	}



	public setHint(text: string): void {
		(async () => {
			await this.isUIReady();
			if (this.hintElement == null) {
				console.error("hintElement not set!");
				return;
			}

			Media.playAudio("au_error.mp3");
			this.hintElement.innerText = text;
			this.parentHintElement.style.visibility = "visible";
		})();

	}


	public removeHint(): void {
		(async () => {
			await this.isUIReady();

			if (this.hintElement == null) {
				return;
			}

			this.parentHintElement.style.visibility = "hidden";
			this.hintElement.innerText = "";
		})();
	}






}