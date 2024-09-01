import { Menu } from "./menu";
import { JSONArray, JSONObject } from "../../../core/Utils/Json";
import { StringUtils } from "../../../core/Utils/StringUtils";
import { UI } from "../../ui/UI";
import { SettingController } from "../../pages/setting/setting.controller";
import { Router } from "../../../core/Router";


export class MenuController {

	private static readonly STATE_COLLAPSED: number = 1;
	private static readonly STATE_COMPACTED: number = 2;
	private static readonly STATE_EXPANDED: number = 3;
	private static readonly HEIGHT_LI: number = 34;


	private component: Menu;
	private list: JSONArray;
	private state: number = 0;
	private oldState: number = 0;
	private oldPageWidthSize: number = 0;
	private activePage: Page = new Page();
	private isSupportLanguage: boolean = false;
	public menuItems: HTMLCollectionOf<Element>;


	constructor(component: Menu, menuList: JSONArray, isSupportLanguage: boolean) {
		this.component = component;
		this.list = menuList;
		this.isSupportLanguage = isSupportLanguage;


		this.onCreate();
		this.menuItems = this.component.menuList.getElementsByClassName("item"); // Get items from page
		this.updateActivePage();
		this.onResize(); // Update Menu State, Set Active Page 
	}


	public onDestroy(): void {

	}


	public onRouteEvent(json: JSONObject): void {
		this.removeSelectedItem();
		this.updateActivePage();
		//console.log("index", this.activePage.index);
		//console.log("childIndex", this.activePage.childIndex);
		this.setSelectedItem();
	}

	public updateLanguage(): void {

	}



	public OnClickSideBar(): void {
		if (UI.width >= UI.SIZE_TABLET) {
			if (this.state === MenuController.STATE_COLLAPSED || this.state === MenuController.STATE_COMPACTED) {
				this.updateState(MenuController.STATE_EXPANDED);
			} else {
				this.updateState(MenuController.STATE_COMPACTED);
			}

		} else if (UI.width < UI.SIZE_TABLET && UI.width > UI.SIZE_PHONE) {
			if (this.state === MenuController.STATE_EXPANDED) {
				this.updateState(MenuController.STATE_COMPACTED);
			} else {
				this.updateState(MenuController.STATE_EXPANDED);
			}

		} else {
			if (this.state === MenuController.STATE_COLLAPSED) {
				this.updateState(MenuController.STATE_EXPANDED);
			} else {
				this.updateState(MenuController.STATE_COLLAPSED);
			}
		}
	}



	public onClick(index: number, childIndex: number): void {
		//console.log("onClick - index: " + index + " - childIndex: " + childIndex);
		//const rawBorderColor: string = getComputedStyle(document.getElementById("App")).getPropertyValue('--background-color-1');
		var childList: HTMLUListElement = <HTMLUListElement>(this.menuItems[index].getElementsByClassName("child-list")[0]);

		if (childIndex == null) {
			if (!this.list.getJSONObject(index).isNull("children")) {
				if (childList.getBoundingClientRect().height > 0) {
					if (this.state === MenuController.STATE_COMPACTED) {
						this.updateState(MenuController.STATE_EXPANDED);
						return;
					}
					childList.style.height = "0";
					childList.classList.remove("child-list-open");
					UI.rotate(<HTMLLIElement>(this.menuItems[index].getElementsByClassName("arrow")[0]), 0);
				} else {
					if (this.state === MenuController.STATE_COMPACTED) {
						this.updateState(MenuController.STATE_EXPANDED);
					}
					UI.rotate(<HTMLLIElement>(this.menuItems[index].getElementsByClassName("arrow")[0]), -90);

					childList.style.height = (this.menuItems[index].childElementCount * MenuController.HEIGHT_LI) + "px";
					childList.classList.add("child-list-open");
				}

				return;
			}
			this.navigate(this.list.getJSONObject(index).getString("path"))
		} else {
			console.log(this.list.getJSONObject(index).getJSONArray("children").getJSONObject(childIndex).getString("path"))
			this.navigate(this.list.getJSONObject(index).getJSONArray("children").getJSONObject(childIndex).getString("path"));
		}

		if (this.state === MenuController.STATE_EXPANDED && UI.width < UI.SIZE_TABLET) {
			if (UI.width > UI.SIZE_PHONE) {
				this.updateState(MenuController.STATE_COMPACTED);
			} else {
				this.updateState(MenuController.STATE_COLLAPSED);
			}
		}
	}


	public onResize(): void {
		if (UI.width >= UI.SIZE_TABLET) {
			this.updateState(MenuController.STATE_EXPANDED);
		} else if (UI.width < UI.SIZE_TABLET && UI.width > UI.SIZE_PHONE) {
			this.updateState(MenuController.STATE_COMPACTED);
		} else {
			this.updateState(MenuController.STATE_COLLAPSED);
		}
		this.oldPageWidthSize = UI.width;
	}



	public onClickListner(e: MouseEvent): void {

		if (this.component.menuContainer == null) {
			return;
		}

		if (this.component.sideBar == null) {
			this.component.sideBar = <HTMLDivElement>document.getElementById("Header_Menu_Button");
			if (this.component.sideBar == null) {
				return;
			}
		}

		if (event.target instanceof HTMLElement) {
			if (!this.component.menuContainer.contains(e.target as HTMLElement) && !this.component.sideBar.contains(e.target as HTMLElement)) {
				if (UI.width < UI.SIZE_TABLET) {
					if (this.state === MenuController.STATE_EXPANDED) {
						this.OnClickSideBar();
					}
				}
			}
		}

	}






	private updateState(state: number): void {
		this.oldState = this.state;
		this.state = state;
		var menuWidth: number = 0;

		var isMenuDisplayChanged: boolean = false;
		var isMenuVisible: boolean = true;
		var isTextDisplayChanged: boolean = false;
		var isTextVisible: boolean = true;
		var isChildListDisplayChanged: boolean = false;
		var isChildListVisible: boolean = true;

		if (state === MenuController.STATE_EXPANDED) {

			if (this.oldState === MenuController.STATE_EXPANDED) {
				if (this.oldPageWidthSize >= UI.SIZE_TABLET && UI.width >= UI.SIZE_TABLET) {
					return;
				}

				if ((this.oldPageWidthSize < UI.SIZE_TABLET && this.oldPageWidthSize > UI.SIZE_PHONE) && (UI.width < UI.SIZE_TABLET && UI.width > UI.SIZE_PHONE)) {
					return;
				}

				if (this.oldPageWidthSize <= UI.SIZE_TABLET && UI.width <= UI.SIZE_TABLET) {
					return;
				}
			}

			if (UI.width >= UI.SIZE_TABLET) {
				if (!UI.getScrollStatus()) {
					UI.setscrollStatus(UI.SCROLL_UPDATER_MENU, true);
				}
				this.component.element.style.position = "static";
				this.component.element.style.width = "auto";
				this.component.menuContainer.style.position = "static";
				this.component.element.className = "menu-component menu-expanded";//Only when screen fit for expanded we update class


			} else if (UI.width < UI.SIZE_TABLET && UI.width > UI.SIZE_PHONE) {
				//Screen is compacted state and need to expand
				if (!UI.getScrollStatus()) {
					UI.setscrollStatus(UI.SCROLL_UPDATER_MENU, true);
				} this.component.element.style.position = "static";
				this.component.element.style.width = "auto";
				this.component.menuContainer.style.position = "static";

			} else {
				//Screen is collapsed state and need to expand
				if (UI.getScrollStatus()) {
					UI.setscrollStatus(UI.SCROLL_UPDATER_MENU, false);
				}
				this.component.element.style.position = "fixed";
				this.component.element.style.width = "100%";
				this.component.menuContainer.style.position = "fixed";
			}


			menuWidth = 256;
			isTextDisplayChanged = true;
			isTextVisible = true;
			isMenuDisplayChanged = true;
			isMenuVisible = true;
			isChildListDisplayChanged = true;
			isChildListVisible = true;

			this.setSelectedItem();


		} else if (state === MenuController.STATE_COMPACTED) {

			menuWidth = 56;
			isMenuDisplayChanged = true;
			isMenuVisible = true;
			isChildListDisplayChanged = true;
			isChildListVisible = false;
			isTextDisplayChanged = true;
			isTextVisible = false;


			if (!UI.getScrollStatus()) {
				UI.setscrollStatus(UI.SCROLL_UPDATER_MENU, true);

			}
			this.component.element.style.position = "static";
			this.component.element.style.width = "auto";
			this.component.menuContainer.style.position = "static";
			this.component.element.className = "menu-component menu-compacted";

			this.setSelectedItem();

		} else if (state === MenuController.STATE_COLLAPSED) {

			if (this.oldState === MenuController.STATE_COLLAPSED) {
				return;
			}

			menuWidth = 0;
			isTextDisplayChanged = true;
			isTextVisible = false;
			isMenuDisplayChanged = true;
			isMenuVisible = false;

			if (!UI.getScrollStatus()) {
				UI.setscrollStatus(UI.SCROLL_UPDATER_MENU, true);
			}
			this.component.element.style.position = "static";
			this.component.element.style.width = "auto";
			this.component.menuContainer.style.position = "fixed";
			this.component.element.className = "menu-component menu-collapsed";

			this.removeSelectedItem();
		}


		if (isMenuDisplayChanged && isMenuVisible) {
			this.menuVisibility(true);
		}

		if (isTextDisplayChanged && !isTextVisible) { //Text should hide sooner
			this.textDisplay(isTextVisible);
		}

		if (isChildListDisplayChanged && !isChildListVisible) {
			this.menuChildVisibility(isChildListVisible);
		}

		this.component.menuContainer.style.width = menuWidth + "px";

		setTimeout(() => {

			//mene visibility needs to update for both false and true, because of below reason
			if (isMenuDisplayChanged) {
				this.menuVisibility(isMenuVisible);
			}

			// 1)Text should visible with delay
			// 2)If multi change menu fast from expand to compacted, hidden work fast but visible work with delay
			//	 and ruin hidden of text on compacted, so hiddden text should work twice to be sure in compacted we do not have visible text
			if (isTextDisplayChanged) {
				this.textDisplay(isTextVisible);
			}

			//child visibility needs
			if (isChildListDisplayChanged) {
				this.menuChildVisibility(isChildListVisible);
			}

		}, 140);


		if (isMenuVisible) {
			if (this.activePage.index === -1) {
				return;
			}

			var itemSelected: HTMLElement = <HTMLLIElement>(this.menuItems[this.activePage.index]);
			itemSelected.classList.add("selected-item");

			if (this.activePage.childIndex != -1) {
				itemSelected.getElementsByClassName("child-list")[0].getElementsByTagName("li")[this.activePage.childIndex].classList.add("selected-item");
			}
		}

	}




	private setSelectedItem(): void {
		if (this.activePage.index === -1) {
			return;
		}
		this.menuItems[this.activePage.index].classList.add("selected-item");
		if (this.activePage.childIndex !== -1) {
			this.menuItems[this.activePage.index].getElementsByClassName("child-list")[0].getElementsByTagName("li")[this.activePage.childIndex].classList.add("selected-item");
		}
	}

	private removeSelectedItem(): void {
		if (this.activePage.index === -1) {
			return;
		}

		var oldItem: HTMLLIElement = <HTMLLIElement>this.menuItems[this.activePage.index];
		if (this.activePage.childIndex !== -1) {
			oldItem.getElementsByClassName("child-list")[0].getElementsByTagName("li")[this.activePage.childIndex].classList.remove("selected-item");
		}

		oldItem.classList.remove("selected-item");
	}


	private textDisplay(status: boolean): void {
		for (let i = 0; i < this.menuItems.length; i++) {
			if (status) {
				//(<HTMLParagraphElement>this.menuItems[i].getElementsByClassName("clickable")[0].getElementsByTagName("p")[0]).style.display = "inline";
				(<HTMLParagraphElement>this.menuItems[i].getElementsByTagName("p")[0]).style.display = "inline";
				var arrow: HTMLImageElement = <HTMLImageElement>(this.menuItems[i].getElementsByClassName("arrow")[0]);
				if (arrow != null) {
					arrow.style.display = "inline";
				}
			} else {
				(<HTMLParagraphElement>this.menuItems[i].getElementsByTagName("p")[0]).style.display = "none";
				var arrow: HTMLImageElement = <HTMLImageElement>(this.menuItems[i].getElementsByClassName("arrow")[0]);
				if (arrow != null) {
					arrow.style.display = "none";
				}
			}
		}
	}


	private menuVisibility(status: boolean): void {
		for (let i = 0; i < this.menuItems.length; i++) {
			if (status) {
				(<HTMLElement>this.menuItems[i]).style.display = "list-item";
			} else {
				(<HTMLElement>this.menuItems[i]).style.display = "none";
			}
		}
	}


	private menuChildVisibility(status: boolean): void {
		for (let i = 0; i < this.menuItems.length; i++) {
			var childList: HTMLUListElement = <HTMLUListElement>(this.menuItems[i].getElementsByClassName("child-list")[0]);
			if (childList != null) {
				if (status) {
					childList.style.display = "block";
				} else {
					childList.style.display = "none";
				}
			}
		}
	}




	private updateActivePage(): void {
		this.activePage.url = window.document.location.pathname.replace('/' + SettingController.language, "");//Remove Language
		this.activePage.url = this.activePage.url.substring(1); //Remove / at first

		var parentPath: string = this.activePage.url.split('/')[0]; // It may include children, We only want parent
		for (let i: number = 0; i < this.list.length(); i++) {
			if (this.list.getJSONObject(i).getString("path") === parentPath) {
				this.activePage.index = i;

				if (!this.list.getJSONObject(i).isNull("children")) {

					for (let j: number = 0; j < this.list.getJSONObject(i).getJSONArray("children").length(); j++) {
						if (this.list.getJSONObject(i).getJSONArray("children").getJSONObject(j).getString("path") === this.activePage.url) {
							this.activePage.childIndex = j;
							break;
						}

						if (j === this.list.getJSONObject(i).getJSONArray("children").length() - 1) {
							this.activePage.childIndex = -1;
						}
					}
				} else {
					this.activePage.childIndex = -1;
				}

				break;
			}

			if (i === this.list.length() - 1) {
				this.activePage.index = -1;
			}
		}
	}


	private navigate(path: string): void {
		if (StringUtils.isEmpty(path)) {

		} else if (path.startsWith("http://") || path.startsWith("https://")) {
			window.location.href = path;
		} else {
			if (this.isSupportLanguage) {
				Router.navigate("/" + SettingController.language + "/" + path);
			} else {
				Router.navigate("/" + path);
			}
		}
	}


	private onCreate(): void {

		for (let i: number = 0; i < this.list.length(); i++) {
			let item: JSONObject = this.list.getJSONObject(i);
			if (item == null) {
				console.error("Menu List -- Item(" + i + ") is null from menuList");
				continue;
			}

			let li: HTMLLIElement = document.createElement("li");
			li.classList.add("item");

			const div: HTMLDivElement = document.createElement("div");
			div.classList.add("clickable");
			div.addEventListener("click", () => {
				this.component.onClick(i);
			});
			li.appendChild(div);

			const img: HTMLImageElement = document.createElement("img");
			img.classList.add("icon");
			img.src = "../../.." + item.getString("img");
			img.alt = "";
			div.appendChild(img);

			const p: HTMLParagraphElement = document.createElement("p");
			p.innerHTML = item.getString("name");
			div.appendChild(p);


			if (!item.isNull("children")) {
				const children: JSONArray = item.getJSONArray("children");

				const divArrow: HTMLDivElement = document.createElement("div");
				divArrow.classList.add("arrow");
				div.appendChild(divArrow);

				const imgArrow: HTMLImageElement = document.createElement("img");
				imgArrow.src = "/assets/svg/arrow_handless_left.svg";
				imgArrow.alt = "";
				divArrow.appendChild(imgArrow);


				const childernUL: HTMLUListElement = document.createElement("ul");
				childernUL.classList.add("child-list");
				li.appendChild(childernUL);

				for (let j: number = 0; j < children.length(); j++) {
					const child: JSONObject = children.getJSONObject(j);

					const li: HTMLLIElement = document.createElement("li");
					childernUL.appendChild(li);

					const div: HTMLDivElement = document.createElement("div");
					div.classList.add("clickable-child");
					div.addEventListener("click", () => {
						this.component.onClick(i, j);
					});
					li.appendChild(div);

					const p: HTMLParagraphElement = document.createElement("p");
					p.innerHTML = child.getString("name");
					div.appendChild(p);
				}
			}

			this.component.menuList.appendChild(li);
		}
	}

}



export class Page {
	index: number = -1;
	childIndex: number = -1;
	url: string;
}