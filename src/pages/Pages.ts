import "./ui/styles.scss";
import "./ui/styles-classes.scss";
import { Router } from '../core/Router';
import { Home } from './pages/home/home';
import { ListnerDelegate } from '../core/ListnerDelegate';
import { Header } from './component/header/header';
import { Menu } from './component/menu/menu';
import { Footer } from './component/footer/footer';
import { Page } from './pages/Page';
import { Setting } from './pages/setting/setting';
import { StringUtils } from '../core/Utils/StringUtils';
import { SettingController } from './pages/setting/setting.controller';
import { JSONObject } from '../core/Utils/Json';
import { Toast } from './component/toast/toast';
import { UI } from './ui/UI';
import { Storage } from "../core/Utils/Storage";
import { Color } from './ui/Color';
import { Shop } from "./pages/shop/shop";
import { ContactUs } from "./pages/contact-us/contact-us";
import { Api } from "./pages/api/api";
import { Followergir } from "./pages/applications/followergir/followergir";
import { Membergir } from "./pages/applications/membergir/membergir";



export class Pages {

	private mainElement: HTMLElement;
	private supportLanguage: boolean = true;

	private pageComponent: Page;
	private pageElement: HTMLDivElement;



	constructor(parentElement: HTMLElement) {
		this.mainElement = parentElement;

		this.mainElement.style.setProperty('--global-font', SettingController.font);
		this.themeInit();
		this.toastInit();

		ListnerDelegate.add(this, ListnerDelegate.LISTNER_ROUTE); // Listen to route, because of Router.navigate
		this.onRouteChanged(null);
	}


	public onEvent(id: number, ...args: Object[]): void {
		if (id === ListnerDelegate.LISTNER_ROUTE) {
			this.onRouteChanged(args);
		}
	}




	private onRouteChanged(args: Object[]): void {
		let paths: string[];
		if (args == null) {
			paths = window.location.pathname.split('/');

		} else {
			if (args[0] instanceof JSONObject) {
				if (args[0].getString("newPath") === args[0].getString("oldPath")) {
					return;
				}

				paths = args[0].getString("newPath").split('/');
			}
		}

		var page: string = "";
		if (this.supportLanguage) {
			//window.location.pathname start with /, so paths[0] is empty
			const language: string = paths[1];
			const pageArray: string[] = paths;
			pageArray.splice(0, 2)
			page = pageArray.join('/');

			const regex: RegExp = new RegExp(/(^en$)|(^fa$)/g); // or as string: new RegExp("(en)|(fa)" , "gm")
			//regex.lastIndex = 0; //Because of g(global), if we use multiple test, we should set lastIndex = 0, otherwise it countinue the rest of sentence to search
			if (StringUtils.isEmpty(language) || !regex.test(language)) {
				Router.navigate("/" + SettingController.language + "/home", true);
				return;
			}
		} else {
			page = paths[1];
		}
		
		if (this.pageComponent != null) {
			this.pageComponent.onDestroy();
		}


		//console.log("newPage", page);
		this.setNewPage(page);
	}


	private setNewPage(page: string): void {

		if (this.pageElement == null) {
			const headerElement: HTMLDivElement = document.createElement("div");
			this.mainElement.appendChild(headerElement);
			new Header(headerElement);

			const appElement = document.createElement("div");
			appElement.classList.add("app");
			this.mainElement.appendChild(appElement);

			const menuElement: HTMLDivElement = document.createElement("div");
			appElement.appendChild(menuElement);
			new Menu(menuElement, this.supportLanguage);

			this.pageElement = document.createElement("div");
			this.pageElement.classList.add("page");
			appElement.appendChild(this.pageElement);

			const pageFooterElement: HTMLDivElement = document.createElement("div");
			this.mainElement.appendChild(pageFooterElement);
			new Footer(pageFooterElement);
		}


		switch (page) {
			case ("home"):
				this.pageComponent = new Home(this.pageElement);
				break;

			case ("setting"):
				this.pageComponent = new Setting(this.pageElement);
				break;

			case ("shop"):
				this.pageComponent = new Shop(this.pageElement);
				break;

			case ("contact-us"):
				this.pageComponent = new ContactUs(this.pageElement);
				break;

			case ("api"):
				this.pageComponent = new Api(this.pageElement);
				break;

			case ("applications/followergir"):
				this.pageComponent = new Followergir(this.pageElement);
				break;

			case ("applications/membergir"):
				this.pageComponent = new Membergir(this.pageElement);
				break;

			case ("applications/membergir"):
				this.pageComponent = new Membergir(this.pageElement);
				break;


			default:
				Router.navigate((this.supportLanguage ? "/" + SettingController.language : "") + "/home", false);
				return; //Because of execute again, END it here
		}

	}




	private toastInit(): void {
		let div: HTMLDivElement = document.createElement("div");
		//Main.mainElement.parentElement.insertBefore(div, Main.mainElement.nextSibling); //Insert after a node(mainElement)
		//document.body.insertAdjacentElement("beforeend", div);
		this.mainElement.appendChild(div);
		Toast.initiate(div)
	}




	private themeInit(): void {
		this.mainElement.classList.add(SettingController.theme);
		UI.setCssVariable(UI.mainElement, "color", Storage.getString(Storage.Setting, "color", UI.getCssVariable(UI.mainElement, "basic-color")));
		let color: string = Storage.getString(Storage.Setting, "color", null);
		if (color == null) {
			UI.setCssVariable(UI.mainElement, "color-simple", UI.getCssVariable(UI.mainElement, "basic-color-simple"));
		} else {
			UI.setCssVariable(UI.mainElement, "color-simple", Color.changeColor(color, -50))
		}
		SettingController.setBrowserThemeColor();


		//Detect On user change operation system theme color
		const darkModeMediaQuery: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
		darkModeMediaQuery.addListener((e) => {
			const isDarkModeOn: boolean = e.matches;
			//console.log(`Dark mode is ${darkModeOn ? '?? on' : '?? off'}.`);
			if (isDarkModeOn) {
				if (SettingController.theme === SettingController.THEME_LIGHT) {
					SettingController.setTheme(SettingController.THEME_DARK);
				}
			}
		});

		const lightModeMediaQuery: MediaQueryList = window.matchMedia('(prefers-color-scheme: light)');
		lightModeMediaQuery.addListener((e) => {
			if (e.matches) {
				if (SettingController.theme === SettingController.THEME_DARK) {
					SettingController.setTheme(SettingController.THEME_LIGHT);
				}
			}
		});
	}









	//https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
	//customElements.define("button-view", Button);Autonomous custom elements - support in safari
	//customElements.define("button-view", Button, { extends: "button" }); Customized built-in elements - not support in safari

}





