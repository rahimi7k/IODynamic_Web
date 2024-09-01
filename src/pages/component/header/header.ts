import { Component } from '../Component';
import html from './header.html'
import "./header.scss";


export class Header extends Component {

	private sidebarImageButtonElement: HTMLImageElement;

	private clickOnSelect: boolean = false;
	public static hasClickOnPage: boolean = false;


	private static onClickSideBarDelegate: () => void;




	constructor(parentElement: HTMLElement) {
		super(parentElement, "Header", html, true);
	}


	override onCreate(): void {
		super.onCreate();
	}

	override onViewInit(): void {
		super.onViewInit();
		this.element.classList.add("header-component");

		this.sidebarImageButtonElement = <HTMLImageElement>document.getElementById("Header_Menu_Button");
		this.sidebarImageButtonElement.addEventListener("click", () => {
			if (Header.onClickSideBarDelegate != null) {
				Header.onClickSideBarDelegate();
			}
		});
	}


	override onDestroy(): void {
		super.onDestroy();

	}




	public static setOnClickSideBarDelegate(delegate: () => void): void {
		this.onClickSideBarDelegate = delegate;
	}
 


	public navigateHome(): void {

	}



	public click(select: string) {
		let p = document.getElementById(select);
		if (this.clickOnSelect === false) {
			setTimeout(() => {
				this.clickOnSelect = true;
				p.click();
			}, 10);
		} else {
			this.clickOnSelect = false;
		}
	}

	public rawTheme(themeName: string): string {
		if (themeName.includes("-fa")) {
			themeName = themeName.replace("-fa", "");
		} else if (themeName.includes("-en")) {
			themeName = themeName.replace("-en", "");
		}
		return themeName;
	}



}
