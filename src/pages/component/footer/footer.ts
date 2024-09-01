import { UI } from '../../ui/UI';
import { Component } from '../Component';
import html from './footer.html'
import './footer.scss'


export class Footer extends Component {


	constructor(parentElement: HTMLElement) {
		super(parentElement, "Footer", html, true);

	}

	override onCreate(): void {
		super.onCreate();

		window.addEventListener("resize", this.onResize);
	}

	override onViewInit(): void {
		super.onViewInit();

		this.element.classList.add("footer-component");


	}


	override onDestroy(): void {
		super.onDestroy();

		window.removeEventListener("resize", this.onResize);


	}



	public updateLogo(): void {
		/*var logo = document.getElementById("footer_iodynamic_logo");
		if (Setting.getTheme() === "default" || Setting.getTheme() === "corporate") {
			this.render.setStyle(logo, "src", "assets/images/ic_iodynamic_default.png");	
		} else if (Setting.getTheme() === "dark" || Setting.getTheme() === "cosmic") {
			this.render.setProperty(logo, "src", "assets/images/ic_iodynamic_white.png");
		}
		logo.ondragstart = function () { return false; };
		logo.addEventListener('contextmenu', event => event.preventDefault());*/
	}

	private onResize: () => void = (): void => {
		if (UI.width <= 575) {
			this.element.style.display = "none";
		} else {
			this.element.style.display = "block";
		}
	}

}
