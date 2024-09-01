import { Language } from '../../core/Language/Language';
import { StringUtils } from '../../core/Utils/StringUtils';
import { Main } from '../../main';

export class UI {

	public static readonly SIZE_PHONE: number = 800;
	public static readonly SIZE_TABLET: number = 1200;

	public static readonly SCROLL_UPDATER_POPUP: number = 0x01;
	public static readonly SCROLL_UPDATER_MENU: number = 0x02;

	private static mainElementCache: HTMLElement = null;
	private static scrollPosition: number = 0;

	private static scrollBooked = {
		popup: false,
		menu: false
	};



	public static get mainElement(): HTMLElement {
		if (UI.mainElementCache == null) {
			UI.mainElementCache = <HTMLElement>document.getElementById(Main.MAIN_ELEMENT_ID);
		}
		return UI.mainElementCache;
	}


	public static get width(): number {
		return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	}

	public static get height(): number {
		return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	}


	public static rotate(element: HTMLElement, degrees: number): void;
	public static rotate(element: HTMLElement, degrees: number, duration: number): void;
	public static rotate(element: HTMLElement, degrees: number, duration?: number): void {
		if (element != null) {
			element.style.transitionProperty = "transform"; //The transition-property property specifies the name of the CSS property the transition effect
			//element.style.overflow = "hidden";
			if (duration != null && duration >= 0) {
				element.style.transitionDuration = duration + 's';
			} else {
				element.style.transitionDuration = "0.23s";
			}
			element.style.webkitTransform = "rotate(" + degrees + "deg)";
			element.style.transform = "rotate(" + degrees + "deg)";
		}
	}


	public static getCurrentRotation(element: HTMLElement): number {
		var st = window.getComputedStyle(element, null);
		var tm = st.getPropertyValue("-webkit-transform") ||
			st.getPropertyValue("-moz-transform") ||
			st.getPropertyValue("-ms-transform") ||
			st.getPropertyValue("-o-transform") ||
			st.getPropertyValue("transform") ||
			"none";
		if (tm != "none") {
			var values: string[] = tm.split('(')[1].split(')')[0].split(',');// Get all values inside parentheses (1,2,3)
			/*
			a = values[0];
			b = values[1];
			angle = Math.round(Math.atan2(b,a) * (180/Math.PI));
			*/
			//return Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI)); //this would return negative values the OP doesn't wants so it got commented and the next lines of code added

			var angle: number = Math.round(Math.atan2(Number(values[1]), Number(values[0])) * (180 / Math.PI));
			return (angle < 0 ? angle + 360 : angle); //adding 360 degrees here when angle < 0 is equivalent to adding (2 * Math.PI) radians before
		}
		return 0;
	}



	public static getScrollStatus(): boolean {
		return !document.body.classList.contains("no-scrollable");
	}

	public static setscrollStatus(scrollUpdater: number, isEnable: boolean) {

		if (scrollUpdater === UI.SCROLL_UPDATER_POPUP) {
			if (isEnable) {
				UI.scrollBooked.popup = false;
			} else {
				UI.scrollBooked.popup = true;
			}
		} else if(scrollUpdater === UI.SCROLL_UPDATER_MENU) {
			if (isEnable) {
				UI.scrollBooked.menu = false;
			} else {
				UI.scrollBooked.menu = true;
			}
		}

		if (!isEnable) {
			//document.body.style.overflow = "hidden";
			UI.scrollPosition = window.pageYOffset;
			document.body.style.top = -UI.scrollPosition + "px"; //1) With position: fix; for div, browser transfer scroll to top, so we set the top to -pageYOffset
			document.body.classList.add("no-scrollable");

		} else {

			if (!UI.scrollBooked.menu && !UI.scrollBooked.popup) {
				//document.body.style.overflow = null;
				document.body.classList.remove("no-scrollable");
				window.scrollTo(0, UI.scrollPosition); //2) After enabling scroll for page we scroll to top place
				//document.body.style.top = 0 + "px"; //Or:
				document.body.style.removeProperty("top"); //3)Remove the top
			}
		}

	}


	/**
	 * Return the value of css variable
	 * 
	 * @param key, The key of variable, no need for -- at start
	 * @param element, The specific element
	 */
	public static getCssVariable(element: HTMLElement, key: string): string {
		return getComputedStyle(element).getPropertyValue("--" + key).trim(); //Todo - Get variable with space
	}

	/**
	 * Set css variable
	 * 
	 * @param key, The key of variable, no need for -- at start
	 * @param value, The value of variable
	 * @param element, The specific element
	 */
	public static setCssVariable(element: HTMLElement, key: string, value: string): void {
		element.style.setProperty("--" + key, value);
	}




	public static isDarkModePrefered(): boolean {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return true;
		}

		return false;
	}




	public static detectInputKeyboard(event: any): string {
		let key: string = event.key;
		let code: string;
		let keyCode: number;
		if (event.key !== undefined) {
			key = event.key;
		} else if (event.code !== undefined) {
			code = event.keyCode;
		} else if (event.keyCode !== undefined) {
			keyCode = event.keyCode;
		}

		if (key === "Enter" || code === "Enter" || keyCode === 13) {
			return "Enter";
		}
	}


	public static getTranslate(element: HTMLElement): { x: number, y: number, z: number } {
		var style: CSSStyleDeclaration = window.getComputedStyle(element);
		var matrix: WebKitCSSMatrix = new WebKitCSSMatrix(style.transform);
		return {
			x: matrix.m41,
			y: matrix.m42,
			z: matrix.m43,
		};
	}


	/**
	 *	Get load SVG
	 *	@param color The hex of loader color, do not fill color for global color
	 * 
	 */
	public static getSVGLoader(color: string = null): string {
		return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
				<circle cx="50" cy="50" r="34" stroke-width="8" stroke="${color == null ? UI.getCssVariable(UI.mainElement, "color") : '#' + color}" stroke-dasharray="50 50" fill="none" stroke-linecap="round">
				  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
				</circle>
			</svg>`;
	}


	/**
	 *
	 * Return the first id of founded from parent elements
	 * @param element The target element
	 * @param possibleLoopBack The number of possible loop back from parent element, default is 8
	 * 
	 **/
	public static findParentId(element: HTMLElement, possibleLoopBack: number = 8): string {
		for (let i: number = 0; i <= possibleLoopBack; i++) {
			if (!StringUtils.isEmpty(element.id)) {
				return element.id;
			}
			element = element.parentElement;
		}
		return null;
	}



}
