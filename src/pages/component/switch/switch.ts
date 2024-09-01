import "./switch.scss";
import { Component } from '../Component';
import { StringUtils } from "../../../core/Utils/StringUtils";


export class Switch extends Component {

	private inputDelegate: (event: any, switchComponent: Switch) => void;
	public isDisable: boolean = false;
	private isChecked: boolean = false;
	private color: string;

	constructor(parentElement: HTMLElement, id: string = null, isStatic: boolean = true) {
		super(parentElement, id, null, isStatic);
	}


	override onCreate(): void {
		super.onCreate();
	}


	override onViewInit(): void {
		super.onViewInit();

		this.element.classList.add("switch-component");
		this.element.addEventListener("click", this.onClick);
		this.updateBackgroundColor();
		this.isOnViewCalled = true;
	}


	override onDestroy(): void {
		super.onDestroy();

		this.element.removeEventListener("click", this.onClick);
	}



	public get checked(): boolean {
		return this.isChecked;
	}

	public set checked(checked: boolean) {
		this.isChecked = checked;

		this.updateBackgroundColor();
	}



	private onClick: (e: any) => void = (e: any): void => {
		if (this.isDisable) {
			return;
		}
		this.checked = !this.checked;
		if (this.inputDelegate != null) {
			this.inputDelegate(e, this);
		}
	}


	public setOnClickListener(delegate: (event: any, switchComponent: Switch) => void): void {
		this.inputDelegate = delegate;
	}


	public disable(isDisable: boolean): void {
		this.isDisable = isDisable;
		if (isDisable) {
			this.element.setAttribute("disabled", "true");
			this.element.classList.add("disabled");

		} else {
			this.element.removeAttribute("disabled");
			this.element.classList.remove("disabled");
		}
	}


	public setColor(color: string) {
		this.color = color;
		if (this.checked) {
			this.element.style.backgroundColor = this.color;
		}
	}






	private updateBackgroundColor(): void {
		if (this.isChecked) {
			this.element.classList.add("switch-component-checked");
			this.element.style.backgroundColor = StringUtils.isEmpty(this.color) ? "var(--color)" : this.color;
		} else {
			this.element.classList.remove("switch-component-checked");
			this.element.style.backgroundColor = "#ccc";
		}
	}

}