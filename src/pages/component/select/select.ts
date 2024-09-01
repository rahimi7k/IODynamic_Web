import "./select.scss";
import { SettingController } from '../../pages/setting/setting.controller';
import { StringUtils } from '../../../core/Utils/StringUtils';
import { Component } from '../Component';
import { Language } from '../../../core/Language/Language';
import { ManageData } from '../../../core/Utils/ManageData';
import { Interval } from '../../../core/Utils/Interval';
import { ArrayList } from "../../../core/Utils/ArrayList";
import { UI } from "../../ui/UI";
import { AppService } from "../../../core/AppService";



export class Select extends Component {

	private isLock: boolean = false;
	private isLoading: boolean = false;

	private _selectedIndex: number;
	private lastIndex: number = -1;

	private _list: ArrayList<Select.Item>;

	private iFinish: () => void;
	private iChange: (selected: Select.Item) => void;

	private button: HTMLButtonElement;
	private image: HTMLImageElement;
	private buttonContainer: HTMLDivElement;
	private p: HTMLParagraphElement;
	private containerElement: HTMLElement;
	private listElement: HTMLDivElement;
	private noItemElement: HTMLDivElement;
	private arrowImg: HTMLImageElement;




	constructor(parentElement: HTMLElement, isStatic: boolean, list: ArrayList<Select.Item>, selectedIndex: number = -1) {
		super(parentElement, null, null, isStatic, Component.HTML_TYPE_DIV);

		this._selectedIndex = selectedIndex;
		this._list = list;
	}

	override onCreate() {
		super.onCreate();

	}

	override onViewInit(): void {
		super.onViewInit();

		this.element.classList.add("select-component", SettingController.direction);

		this.button = document.createElement("button");
		this.button.className = "select-button clickable";
		this.button.addEventListener("click", this.showSelect);
		this.element.appendChild(this.button);

		this.buttonContainer = document.createElement("div");
		this.buttonContainer.classList.add("button-container");
		this.button.appendChild(this.buttonContainer);

		this.arrowImg = document.createElement("img");
		this.arrowImg.classList.add("arrow");
		this.arrowImg.src = "/assets/svg/handless_arrow_down.svg";
		this.arrowImg.alt = "";
		this.buttonContainer.appendChild(this.arrowImg);

		this.image = document.createElement("img");
		this.image.classList.add("select-img");
		this.image.alt = "";
		this.buttonContainer.appendChild(this.image);

		const textContainer: HTMLDivElement = document.createElement("div");
		textContainer.className = "text-container";
		this.buttonContainer.appendChild(textContainer);

		this.p = document.createElement("p");
		textContainer.appendChild(this.p);

		this.containerElement = document.createElement("div");
		this.containerElement.classList.add("container", "disable-select");
		this.containerElement.addEventListener('scroll', this.onScroll);
		this.element.appendChild(this.containerElement);



		this.isOnViewCalled = true;

		window.addEventListener("click", this.onClick);

		this.reCreate(false);
	}


	override onDestroy(): void {
		super.onDestroy();

		if (this.button != null) {
			this.button.removeEventListener("click", this.showSelect);
		}
		if (this.containerElement != null) {
			this.containerElement.removeEventListener('scroll', this.onScroll);
		}
		window.removeEventListener("click", this.onClick);

	}



	public reCreate(unselectDefault: boolean): void {

		new Promise(async () => {
			await this.isUIReady();

			if (unselectDefault) {
				this._selectedIndex = -1;
			}
			this.lastIndex = 0;
			this.button.disabled = true;

			console.log("this.items", this._list);


			// Remove old items
			if (this.containerElement != null) {
				let itemCounts: number = this.containerElement.childElementCount;
				for (let counter = 0; counter < itemCounts; counter++) {
					this.containerElement.removeChild(this.containerElement.children[0]);
				}
			}

			// Selected Item
			if (this._selectedIndex == -1) {
				this.image.style.display = "none";
				this.p.innerText = Language.language.Select_Choose_From_List;

			} else {
				if (StringUtils.isEmpty(this._list.get(this._selectedIndex).image)) {
					this.image.style.display = "none";
				} else {
					this.image.src = this._list.get(this._selectedIndex).image;
					this.image.style.display = "inline";
				}

				this.p.innerText = this._list.get(this._selectedIndex).text;
				if (this.iChange != null) {
					this.iChange(this._list.get(this._selectedIndex));
				}
			}

			// Create Items
			if (this._list.length === 0) {
				this.createNoItem();
			} else {
				this.createListContainer();
				this.onLoadItems();
			}


			this.button.disabled = false;

			if (this.iFinish instanceof Function) {
				this.iFinish();
			}

		});
	}

	private onScroll: () => void = (): void => {
		if (this.isLoading) {
			return;
		}
		this.isLoading = true;

		if (this.listElement.scrollTop + this.listElement.offsetHeight > this.listElement.scrollHeight - 100) {
			this.onLoadItems();
		}

		this.isLoading = false;
	}


	private onLoadItems(): void {

		var initialItemCount: number = this.lastIndex === -1 ? 0 : this.lastIndex;
		for (var i: number = initialItemCount; i < initialItemCount + 10; i++) {

			if (i > this._list.length - 1) {
				break;
			}
			this.listElement.appendChild(this.createItem(this._list.get(i)));
			this.lastIndex++;
		}
	}



	private onClick: (event: any) => void = (event: any): void => {
		if (this.button != null && !this.button.contains(event.target) && this.containerElement.classList.contains("show")) {
			this.containerElement.classList.remove("show");
			UI.rotate(this.arrowImg, 0);
		}
	}

	private onItemClick(item: Select.Item): void {
		if (this.isLock) {
			return;
		}

		this._selectedIndex = this._list.getIndex(item);

		this.p.innerText = item.text;
		if (StringUtils.isEmpty(item.image)) {
			this.image.style.display = "none";
		} else {
			this.image.src = item.image;
			this.image.style.display = "inline";
		}

		if (this.iChange != null && this.iChange instanceof Function) {
			this.iChange(item);
		}
	}


	private showSelect: () => void = (): void => {
		if (!this.containerElement.classList.contains("show")) {
			this.containerElement.classList.add("show");
			if (SettingController.direction === "rtl") {
				UI.rotate(this.arrowImg, 90);
			} else {
				UI.rotate(this.arrowImg, -90);
			}
		}
	}



	private createListContainer(): void {
		if (this.noItemElement != null) {
			this.noItemElement.remove();
			this.noItemElement = null;
		}

		this.listElement = document.createElement("div");
		this.listElement.classList.add("list", "disable-select");
		this.listElement.addEventListener('scroll', this.onScroll);
		this.containerElement.appendChild(this.listElement);
	}

	private createNoItem(): void {
		if (this.listElement != null) {
			this.listElement.remove();
			this.listElement = null;
		}

		this.noItemElement = document.createElement("div");
		this.noItemElement.classList.add("empty");
		this.containerElement.appendChild(this.noItemElement);

		var text: HTMLParagraphElement = document.createElement("p");
		text.innerText = Language.language.Select_No_Item;
		this.noItemElement.appendChild(text);
	}


	private createItem(item: Select.Item): HTMLDivElement {

		const itemElement: HTMLDivElement = document.createElement("div");
		itemElement.classList.add("item");
		itemElement.addEventListener("click", () => {
			this.onItemClick(item);
		});

		if (item.image != null && item.image !== "") {
			let img: HTMLImageElement = document.createElement("img");
			img.alt = "";
			img.src = item.image;
			itemElement.appendChild(img);
		}

		let msg: HTMLParagraphElement = document.createElement("p");
		msg.innerText = item.text;
		itemElement.appendChild(msg);


		if (item.description != null && item.description !== "") {
			let description: HTMLParagraphElement = document.createElement("p");
			description.innerText = item.description;
			description.classList.add("description");
			itemElement.appendChild(description);
		}

		return itemElement;
	}


	private clearSelected(): void {
		this._selectedIndex = -1;
		this.p.innerText = Language.language.Select_Choose_From_List;
		this.image.src = "";
		this.image.style.display = "none";
	}




	public onChange(iChange: (selected: Select.Item) => void): void {
		this.iChange = iChange;
	}

	public onFinish(iFinish: () => void): void {
		this.iFinish = iFinish;
	}

	public setLock(isLock: boolean): void {
		this.isLock = isLock;
	}

	public get selectedIndex(): number {
		return this._selectedIndex;
	}

	public get list(): ArrayList<Select.Item> {
		return this._list;
	}

	public get selectedItem(): Select.Item {
		return this._selectedIndex !== -1 ? this._list.get(this._selectedIndex) : null;
	}

	public set selectedItem(item: Select.Item) {

		if (item == null) {
			this._selectedIndex = -1;
			this.clearSelected();

		} else {
			this._selectedIndex = this._list.getIndex(item);

			this.p.innerText = item.text;
			if (StringUtils.isEmpty(item.image)) {
				this.image.style.display = "none";
			} else {
				this.image.src = item.image;
				this.image.style.display = "inline";
			}

			if (this.iChange != null && this.iChange instanceof Function) {
				this.iChange(item);
			}
		}

	}



	public add(item: Select.Item, inFirst: boolean): void {

		if (this.listElement == null) {
			this.createListContainer();
		}

		if (inFirst) {
			this._list.unshift(item);
			this.listElement.insertAdjacentElement("afterbegin", this.createItem(this._list.get(0)));
			this.lastIndex++;
		} else {
			this._list.push(item);
			if (this.lastIndex === this._list.length - 1) {
				this.listElement.appendChild(this.createItem(this._list.get(this._list.length - 1)));
				this.lastIndex++;
			}
		}
	}

	public remove(index: number): void {
		this._list.removeAtPosition(index);
		this.listElement.children[index].remove();
		this.lastIndex--;
		if (this._list.length === 0) {
			this.createNoItem();
		}

		if (index === this._selectedIndex) {
			this.clearSelected();

			if (this.iChange != null) {
				this.iChange(null);
			}
		}
	}

	public removeItemById(id: string): void {
		for (let i: number = 0; i < this._list.length; i++) {
			if (id === this._list.get(i).id) {
				this.remove(i);
			}
		}
	}



}



export namespace Select {

	export class Item {
		public id: string | number;
		public text: string;
		public image: string;
		public description: string;

		constructor(id: string, text: string, image: string, description?: string) {
			this.id = id;
			this.text = text;
			this.image = image;
			this.description = description;
		}
	}

}
