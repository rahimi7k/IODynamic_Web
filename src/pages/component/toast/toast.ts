import { SettingController } from '../../pages/setting/setting.controller';
import { StringUtils } from '../../../core/Utils/StringUtils';
import { Component } from '../Component';
import { Color } from '../../ui/Color';
import { Language } from '../../../core/Language/Language';
import { Media } from '../../../core/Utils/Audio';
import { ManageData } from '../../../core/Utils/ManageData';
import "./toast.scss";


export class Toast {


	public static readonly STATUS_DEFAULT: number = 0x00;
	public static readonly STATUS_ERROR: number = 0x01;
	public static readonly STATUS_WARNING: number = 0x02;
	public static readonly STATUS_SUCCESS: number = 0x03;

	private static element: HTMLElement;



	public static initiate(parentElement: HTMLElement): void {
		Toast.element = parentElement;
		Toast.element.classList.add("toast-component", SettingController.direction);
	}


	public static show(status: number, meesage: string): void {

		let toast: HTMLDivElement = document.createElement("div");
		toast.classList.add("toast-item");
		toast.addEventListener('click', function handler(e: Event) {
			let el: HTMLElement = e.target as HTMLElement;
			let toastElement: HTMLElement;
			do {
				if (el == null) {
					return;
				}
				if (el.className === "toast-item") {
					toastElement = el;
				} else {
					el = el.parentElement;
				}
			} while (toastElement == null);
			Toast.onClick(el);
			this.removeEventListener('click', handler);
		});
		Toast.element.appendChild(toast);
		toast.style.left = "500px";

		let headerElement: HTMLDivElement = document.createElement("div");
		headerElement.classList.add("header-toast");
		toast.appendChild(headerElement);

		let headerImageConatainer: HTMLDivElement = document.createElement("div");
		headerImageConatainer.classList.add("image-container");
		headerElement.appendChild(headerImageConatainer);

		let headerImage: HTMLImageElement = document.createElement("img");
		headerImage.alt = "";
		headerImageConatainer.appendChild(headerImage);

		let headerText: HTMLElement = document.createElement("b");
		headerElement.appendChild(headerText);
		switch (status) {
			case (Toast.STATUS_DEFAULT):
				headerText.innerText = Language.language.Notification;
				headerImage.src = "/assets/svg/info.svg";
				Media.playAudio("au_toast_notification.wav");
				break;

			case (Toast.STATUS_ERROR):
				headerText.innerText = Language.language.Error;
				headerImage.src = "/assets/svg/close.svg";
				Media.playAudio("au_toast_error.mp3");
				break;

			case (Toast.STATUS_WARNING):
				headerText.innerText = Language.language.Warning;
				headerImage.src = "/assets/svg/warning.svg";
				Media.playAudio("au_toast_warning.mp3");
				break;

			case (Toast.STATUS_SUCCESS):
				headerText.innerText = Language.language.Notification;
				headerImage.src = "/assets/svg/tik_green.svg";
				Media.playAudio("success.mp3");
				break;


			default:
				headerText.innerText = Language.language.Notification;
				headerImage.src = "/assets/svg/info.svg";
				break;
		}


		let body: HTMLDivElement = document.createElement("div");
		body.classList.add("body-toast");
		toast.appendChild(body);


		let text: HTMLParagraphElement = document.createElement("p");
		text.innerHTML = meesage;
		body.appendChild(text);

		setTimeout(() => {
			toast.style.left = "0px";
		}, 20);

		setTimeout(() => {
			Toast.close(toast);
		}, 3200);
	}

	private static onClick(toastElement: HTMLElement): void {
		Toast.close(toastElement);
	}

	private static close(toastElement: HTMLElement) {
		// I don't care about the timer, it checks toastElement is null and do nothing
		if (toastElement != null) {
			toastElement.style.left = "500px";

			setTimeout(() => {
				toastElement.remove();
			}, 300);//transition is 300ms
		}
	}

}
