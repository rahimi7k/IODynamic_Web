import "./popup.scss";
import { SettingController } from '../../pages/setting/setting.controller';
import { StringUtils } from '../../../core/Utils/StringUtils';
import { Component } from '../Component';
import { ManageData } from '../../../core/Utils/ManageData';
import { Interval } from '../../../core/Utils/Interval';
import { UI } from "../../ui/UI";

export class PopUp extends Component {

	public smallSize: boolean;
	public direction: string;
	public componentId: string;
	private isCancelable: boolean = true;
	public enableScrollOnClose: boolean = true;

	private popupCenter: HTMLDivElement;
	private popupHeader: HTMLDivElement;
	private popupHeaderCloseImage: HTMLImageElement;
	private popupBody: HTMLDivElement;
	protected popupContainer: HTMLDivElement;

	private closeDelegate: () => void;
	private openDelegate: () => void;





	constructor(parentElement: HTMLElement, smallSize: boolean = false, enableScrollOnClose: boolean = true) {
		super(parentElement, null, null, false, Component.HTML_TYPE_DIV);

		this.smallSize = smallSize;
		this.enableScrollOnClose = enableScrollOnClose;
	}


	override onCreate(): void {
		super.onCreate();
	}

	override onViewInit(): void {
		super.onViewInit();
		UI.setscrollStatus(UI.SCROLL_UPDATER_POPUP, false);


		this.element.classList.add(this.smallSize ? "dialog-component" : "popup-component");

		this.popupCenter = document.createElement("div");
		this.popupCenter.classList.add("popup-center");
		this.element.appendChild(this.popupCenter)

		this.popupHeader = document.createElement("div");
		this.popupHeader.classList.add("popup-header", "glass-header");
		this.popupCenter.appendChild(this.popupHeader)

		this.popupHeaderCloseImage = document.createElement("img");
		//this.popupHeaderCloseImage.src = urlClose;
		this.popupHeaderCloseImage.alt = "close";
		this.popupHeaderCloseImage.draggable = false;
		this.popupHeaderCloseImage.addEventListener("click", this.onClickClose);
		this.popupHeader.appendChild(this.popupHeaderCloseImage)


		this.popupBody = document.createElement("div");
		this.popupBody.classList.add("popup-body");
		this.popupCenter.appendChild(this.popupBody)

		this.popupContainer = document.createElement("div");
		this.popupContainer.classList.add("popup-container");
		this.popupBody.appendChild(this.popupContainer)


		this.onResize();

		window.addEventListener("resize", this.onResize);
		document.addEventListener("keyup", this.keyEvent);
		this.addCloseImageListners();

		this.isOnViewCalled = true;
	}



	override onDestroy(): void {
		super.onDestroy();

		if (this.enableScrollOnClose) {
			UI.setscrollStatus(UI.SCROLL_UPDATER_POPUP, true);

		}

		document.removeEventListener("resize", this.onResize);
		document.removeEventListener("keyup", this.keyEvent);
		this.removeCloseImageListners();
	}



	public async getContainer(): Promise<HTMLDivElement> {
		return new Promise<HTMLDivElement>(async (resolve): Promise<void> => {
			await this.isUIReady();
			resolve(this.popupContainer);
		});
	}

	public append(element: HTMLElement): void {
		(async (): Promise<void> => {
			await this.isUIReady();
			this.popupContainer.appendChild(element);
		})();
	}



	public setCancelable(bool: boolean): void {
		this.isCancelable = bool;
	}


	public setOnOpenListener(delegate: () => void): void {
		this.openDelegate = delegate;
	}

	public setOnCloseListener(delegate: () => void): void {
		this.closeDelegate = delegate;
	}



	public show(): void {

		new Interval(() => {
			if (this.popupHeaderCloseImage == null) {
				return false;
			}
			this.popupHeaderCloseImage.src = "/assets/images/ic_close.png";
			return true;
		}, 99, 45, 0, "PopUp show");

		this.element.scrollTop = 0;

		if (this.openDelegate != null) {
			this.openDelegate();
		}
		this.element.style.visibility = "visible";
	}


	private onClickClose: () => void = (): void => {
		if (!this.isCancelable) {
			return;
		}
		this.close();
	}


	public close(): void {
		this.openDelegate = null;
		if (this.closeDelegate != null) {
			this.closeDelegate();
			this.closeDelegate = null;
		}

		this.element.remove();
		this.onDestroy();
	}




	private onResize = (): void => {
		var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		if (this.popupCenter.offsetHeight !== 0 && this.popupHeader.offsetHeight !== 0) {
			if (this.popupCenter.getBoundingClientRect().height < h / 1.05) {

				this.popupCenter.style.top = "50%";
				this.popupCenter.style.left = "50%";
				this.popupCenter.style.transform = "translate(-50%, -50%)";
				this.popupCenter.style.borderRadius = "8px";
				this.popupHeader.style.borderTopRightRadius = "8px";
				this.popupHeader.style.borderTopLeftRadius = "8px";

			} else {
				this.popupCenter.style.top = "0";
				this.popupCenter.style.left = "50%";
				this.popupCenter.style.transform = "translateX(-50%)";
				this.popupCenter.style.borderRadius = "0";
				this.popupHeader.style.borderTopRightRadius = "0";
				this.popupHeader.style.borderTopLeftRadius = "0";
			}
		}
	}




	private addCloseImageListners(): void {
		this.popupHeaderCloseImage.addEventListener("mousedown", this.onCloseDown);
		this.popupHeaderCloseImage.addEventListener("mouseup", this.onCloseUp);
		this.popupHeaderCloseImage.addEventListener("touchend", this.onCloseUp);
		this.popupHeaderCloseImage.addEventListener("mouseenter", this.onMouseInElement);
		this.popupHeaderCloseImage.addEventListener("mouseleave", this.onMouseOutElement);
		this.popupHeaderCloseImage.addEventListener("dragstart", this.onDragStart);
		this.popupHeaderCloseImage.addEventListener("touchstart", this.onCloseDown, { passive: true });
	}


	private removeCloseImageListners(): void {
		this.popupHeaderCloseImage.removeEventListener("mousedown", this.onCloseDown);
		this.popupHeaderCloseImage.removeEventListener("mouseup", this.onCloseUp);
		this.popupHeaderCloseImage.removeEventListener("touchend", this.onCloseUp);
		this.popupHeaderCloseImage.removeEventListener("mouseenter", this.onMouseInElement);
		this.popupHeaderCloseImage.removeEventListener("mouseleave", this.onMouseOutElement);
		this.popupHeaderCloseImage.removeEventListener("dragstart", this.onDragStart);
		this.popupHeaderCloseImage.removeEventListener("touchstart", this.onCloseDown);

		//Remove onClickListner
		this.popupHeaderCloseImage.removeEventListener("click", this.onClickClose);

	}


	private onDragStart: () => boolean = (): boolean => {
		return false;
	}

	private onCloseDown: () => void = (): void => {
		this.popupHeaderCloseImage.src = "/assets/images/ic_close_focus.png";
	}

	private onCloseUp: () => void = (): void => {
		this.popupHeaderCloseImage.src = "/assets/images/ic_close.png";
	}


	private onMouseInElement: () => void = (): void => {
		this.popupHeaderCloseImage.src = "/assets/images/ic_close_on.png";
	}

	private onMouseOutElement: () => void = (): void => {
		this.popupHeaderCloseImage.src = "/assets/images/ic_close.png";
	}




	private keyEvent: (event: KeyboardEvent) => void = (event: KeyboardEvent): void => {
		var code;
		if (event.key !== undefined) {
			code = event.key; // event.key
		} else if (event.keyCode !== undefined) {
			code = event.keyCode; // event.keyCode deprecated
		}

		switch (code) {
			case "Esc": // IE/Edge specific value
			case "Escape":
			case 27:
				this.close();
				break;

			default:
				return;
		}
	}

}
