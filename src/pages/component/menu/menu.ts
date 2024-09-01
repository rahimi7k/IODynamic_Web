import "./menu.scss";
import { Component } from '../Component';
import { Header } from '../header/header';
import { MenuController } from './menu.controller';
import { JSONArray, JSONObject } from '../../../core/Utils/Json';
import { Language } from '../../../core/Language/Language';
import { ListnerDelegate } from '../../../core/ListnerDelegate';



export class Menu extends Component {

	public sideBar: HTMLElement;
	public menuContainer: HTMLElement;
	public menuList: HTMLUListElement;

	private controller: MenuController;
	private supportLanguage: boolean;

	constructor(parentElement: HTMLElement, supportLanguage: boolean) {
		super(parentElement, /*"Menu"*/null, null, true);
		this.supportLanguage = supportLanguage;
	}


	override onCreate(): void {
		super.onCreate();
	}


	override onViewInit(): void {
		super.onViewInit();
		//console.log("Menu onView Called!");

		this.element.classList.add("menu-component");

		this.menuContainer = document.createElement("div");
		this.menuContainer.id = "Menu_Container";
		this.menuContainer.classList.add("menu-container");
		this.element.appendChild(this.menuContainer);

		this.menuList = document.createElement("ul");
		this.menuList.id = "Menu_List";
		this.menuList.classList.add("list", "disable-select", "disable-drag");
		this.menuContainer.appendChild(this.menuList);


		const list: any = [
			{ path: "home", img: "/assets/svg/home.svg", name: Language.language.Menu_Home },
			{
				path: "login", img: "/assets/svg/application.svg", name: Language.language.Menu_Login_Application,
				children: [
					{ path: "https://followergir.iodynamic.com", name: Language.language.Menu_Login_Application_Followergir },
					{ path: "", name: Language.language.Menu_Login_Application_Membergir }
				]
			},
			{
				path: "applications", img: "/assets/svg/applications.svg", name: Language.language.Menu_Application_Info,
				children: [
					{ path: "applications/followergir", name: Language.language.Menu_Application_Followergir },
					{ path: "applications/membergir", name: Language.language.Menu_Application_Membergir }
				]
			},
			{ path: "shop", img: "/assets/svg/shopping_cart.svg", name: Language.language.Menu_Shop },
			{ path: "contact-us", img: "/assets/svg/contact_us.svg", name: Language.language.Menu_ContactUs },
			{ path: "api", img: "/assets/svg/api.svg", name: Language.language.Api_Title },
			{ path: "setting", img: "/assets/svg/setting.svg", name: Language.language.Menu_Setting }
		];

		this.controller = new MenuController(this, new JSONArray(list), this.supportLanguage);




		ListnerDelegate.add(this, ListnerDelegate.LISTNER_ROUTE);

		Header.setOnClickSideBarDelegate(() => {
			this.controller.OnClickSideBar();
		});

		document.addEventListener("click", (e: MouseEvent) => {
			this.controller.onClickListner(e);
		});

		//The difference is onResize() will pass THE RESULT as an argument, and onResize will pass the function itself as an argument.
		//When using a standard function() or onResize, you rely on this to reference the element tied to the EventListener
		window.addEventListener("resize", () => {
			this.controller.onResize();
		});


	}

	override onDestroy(): void {
		super.onDestroy();

	}


	public onEvent(id: number, ...args: Object[]): void {
		if (id === ListnerDelegate.LISTNER_ROUTE) {
			this.controller.onRouteEvent(args[0] as JSONObject);
		} else if (id === ListnerDelegate.LISTNER_LANGUAGE) {
			this.controller.updateLanguage();
		}
	}



	public onClick(index: number): void;
	public onClick(index: number, childIndex: number): void;
	public onClick(index: number, childIndex?: number): void {
		this.controller.onClick(index, childIndex);
	}


}


export class Page {
	number: number = -1;
	url: string;
}