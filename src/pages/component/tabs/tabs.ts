import "./tabs.scss";
import { Interval } from "../../../core/Utils/Interval";
import { Component } from "../Component";
import { ArrayList } from "../../../core/Utils/ArrayList";


export class Tabs extends Component {

	private tabs: ArrayList<Tabs.Tab>;
	private onTabOpened: (tabNumber: number) => void;

	constructor(parentElement: HTMLElement, tabs: ArrayList<Tabs.Tab>, onTabOpened: (tabNumber: number) => void, isStatic: boolean = true) {
		super(parentElement, null, null, isStatic);
		this.tabs = tabs;
		this.onTabOpened = onTabOpened;
	}


	override onCreate(): void {
		super.onCreate();
	}


	override onViewInit(): void {
		super.onViewInit();

		this.element.classList.add("tabs-component");
	
		const buttonContainer: HTMLDivElement = document.createElement("div");
		buttonContainer.className = "buttons-container";
		this.element.appendChild(buttonContainer);

		for (let i: number = 0; i < this.tabs.length; i++) {
			const tab: Tabs.Tab = this.tabs.get(i);

			tab.button = document.createElement("button");
			tab.button.className = "tab-button";
			tab.button.addEventListener("click", () => {
				this.onClick(i);
			});
			buttonContainer.appendChild(tab.button);

			const image: HTMLImageElement = document.createElement("img");
			image.src = tab.imageSrc;
			image.alt = "";
			image.className = "section-header-image";
			tab.button.appendChild(image);

			const p: HTMLParagraphElement = document.createElement("p");
			p.innerText = tab.name;
			tab.button.appendChild(p);

			if (i === 0) {
				tab.button.classList.add("selected-tab");
			} else {
				tab.button.classList.add("normal-tab");
			}
		}


		const tabsContainer: HTMLDivElement = document.createElement("div");
		tabsContainer.className = "tabs-container";
		this.element.appendChild(tabsContainer);

		for (let i: number = 0; i < this.tabs.length; i++) {
			/*const tabElement: HTMLDivElement = document.createElement("div");
			tabElement.className = "tab";
			tabElement.appendChild(this.tabs.get(i).element);
			*/
			tabsContainer.appendChild(this.tabs.get(i).element);
		}


		this.isOnViewCalled = true;
		this.onClick(0);
	}



	override onDestroy(): void {
		super.onDestroy();

		this.tabs.clear();
		this.tabs = null;
	}



	private onClick(tabNumber: number): void {
		if (this.onTabOpened != null) {
			this.onTabOpened(tabNumber);
		}
		for (let i: number = 0; i < this.tabs.length; i++) {
			const tab: Tabs.Tab = this.tabs.get(i);
			if (i === tabNumber) {
				tab.button.classList.add("selected-tab");
				tab.button.classList.remove("normal-tab");
				tab.button.disabled = true;
				tab.element.style.display = "block";
			} else {
				tab.button.classList.add("normal-tab");
				tab.button.classList.remove("selected-tab");
				tab.button.disabled = false;
				tab.element.style.display = "none";
			}
		}
	}


}







export namespace Tabs {

	export class Tab {
		constructor(name: string, imageSrc: string, element: HTMLElement) {
			this.name = name;
			this.imageSrc = imageSrc;
			this.element = element;
		}

		public name: string;
		public imageSrc: string;
		public button: HTMLButtonElement;
		public element: HTMLElement;

	}

}
