import { Storage } from '../../../core/Utils/Storage';
import { Network } from '../../../core/Network';
import { Subscriber } from '../../../core/Subscriber';
import { UI } from '../../ui/UI';
import { Color } from '../../ui/Color';
import { StringUtils } from '../../../core/Utils/StringUtils';


export class SettingController {

	public static settingSubscriber: Subscriber = new Subscriber();

	public static readonly THEME_LIGHT: string = "light";
	public static readonly THEME_DARK: string = "dark";
	public static readonly THEME_NAVY: string = "navy";
	public static readonly THEME_COSMIC: string = "cosmic";



	public static get theme(): string {
		var theme: string = Storage.getString(Storage.Setting, "Theme", "");
		if (StringUtils.isEmpty(theme)
			|| (theme != SettingController.THEME_LIGHT
			&& theme != SettingController.THEME_DARK
			&& theme != SettingController.THEME_NAVY
			&& theme != SettingController.THEME_COSMIC)) {
			if (UI.isDarkModePrefered()) {
				theme = SettingController.THEME_DARK;
			} else {
				theme = SettingController.THEME_LIGHT;
			}
		}

		return theme;
	}


	public static get font(): string {
		if (SettingController.language === "fa") {
			return "WebYekan";
		} else {
			return "OpenSans";
		}
	}

	public static set font(font: string) {
		Storage.put(Storage.Setting, "Font", font);
	}


	public static get direction(): string {
		if (SettingController.language === "fa") {
			return "rtl";
		}
		return "ltr";
	}



	public static get language(): string {

		var language: string = Storage.getString(Storage.Setting, "Language", null);
		if (language != null) {
			return language;
		}

		language = SettingController.getUserLanguage();
		if (language != null) {
			if (language == "fa-IR" || language == "fa") {
				return "fa";
			}
		}

		return "en";
	}


	private static getUserLanguage(): string {

		var nav: any = window.navigator;
		var browserLanguagePropertyKeys: string[] = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
		var i: number;
		var language: string;

		// support for HTML 5.1 "navigator.languages"
		if (Array.isArray(nav.languages)) {
			for (i = 0; i < nav.languages.length; i++) {
				language = nav.languages[i];
				if (language && language.length) {
					return language;
				}
			}
		}

		// support for other well known properties in browsers
		for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
			language = nav[browserLanguagePropertyKeys[i]];
			if (language && language.length) {
				return language;
			}
		}

		return null;
	}




	private static async getCountry(): Promise<string> {
		return new Promise<string>(async (resolve): Promise<void> => {

			var res: string = await Network.requestGet("https://www.cloudflare.com/cdn-cgi/trace", null);
			console.log(res);
			console.log(typeof res);
			if (res == null) {
				resolve("us");
				return;
			}
			var parametes: string[] = res.split("\n");
			for (var param of parametes) {
				if (param.includes("loc=")) {
					resolve(param.replace("loc=", "").toLowerCase());
					return;
				}
			}
			resolve("us");
		});
	}

	private static convertCoutryToLanguage(country: string): string {
		if (country === "ir") {
			return "fa";
		} else {
			return "en";
		}
	}




	public static getAudioStatus(): boolean {
		return Storage.getBoolean(Storage.Setting, "IsAudioEnabled", true);
	}

	public static setAudioStatus(isEnable: boolean): void {
		if (isEnable) {
			Storage.remove(Storage.Setting, "IsAudioEnabled");
		} else {
			Storage.put(Storage.Setting, "IsAudioEnabled", false);
		}
	}

	public static getVolume(): number {
		return Storage.getNumber(Storage.Setting, "AudioVolume", 75);
	}

	public static setVolume(volume: number): void {
		Storage.put(Storage.Setting, "AudioVolume", volume);
	}


	public static setTheme(theme: string): void {
		UI.mainElement.classList.remove(SettingController.theme);
		Storage.put(Storage.Setting, "Theme", theme);
		UI.mainElement.classList.add(SettingController.theme);
		if (StringUtils.isEmpty(Storage.getString(Storage.Setting, "color", null))) {
			SettingController.setDeafultCssVariables();
		}
		SettingController.setBrowserThemeColor();
	}



	public static setDeafultCssVariables(): void {
		UI.setCssVariable(UI.mainElement, "color", UI.getCssVariable(UI.mainElement, "basic-color"));
		UI.setCssVariable(UI.mainElement, "color-simple", UI.getCssVariable(UI.mainElement, "basic-color-simple"))
		Storage.remove(Storage.Setting, "color");
	}

	public static setNewCssVariables(color: string): void {
		UI.setCssVariable(UI.mainElement, "color", color);
		UI.setCssVariable(UI.mainElement, "color-simple", Color.changeColor(color, -50))
		Storage.put(Storage.Setting, "color", color);
	}



	public static setBrowserThemeColor(): void {
		document.querySelector('meta[name="color-scheme"]').setAttribute("content", SettingController.theme === SettingController.THEME_LIGHT ? "light" : "dark");
		document.querySelector('meta[name="theme-color"]').setAttribute("content", UI.getCssVariable(UI.mainElement, "background-color-1"));
	}




	public static isScreenAwakePreffer(): boolean {
		return Storage.getBoolean(Storage.App, "screenAwake", false);
	}






}
