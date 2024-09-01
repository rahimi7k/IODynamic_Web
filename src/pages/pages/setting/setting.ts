import html from './setting.html'
import "./setting.scss";
import { Page } from "../Page";
import { Button } from "../../component/button/button";
import { SettingController } from '../setting/setting.controller';
import { Language } from '../../../core/Language/Language';
import { AppService } from '../../../core/AppService';
import { UI } from '../../ui/UI';
import { Storage } from "../../../core/Utils/Storage";
import { SeekBar } from '../../component/seekbar/seekbar';
import { StringUtils } from '../../../core/Utils/StringUtils';
import { Switch } from '../../component/switch/switch';


export class Setting extends Page {

	private switchAudio: Switch;
	// private dynamicContainer: HTMLDivElement;

	private btnThemeLight: Button;
	private btnThemeDark: Button;
	private btnThemeCosmic: Button;
	private btnThemeNavy: Button;

	private inputSelectColor: HTMLInputElement;
	private volumeValue: HTMLParagraphElement;

	private static Colors: any[];



	/*
	@ViewChild("Setting_Dynamic_Container", { read: ViewContainerRef }) public dynamicContainer!: ViewContainerRef;
	*/


	constructor(parentElement: HTMLElement) {
		super(parentElement, "Setting", html);

		Setting.Colors = [
			{ name: "Yellow", hash: "#ffb900" },
			{ name: "Gold", hash: "#ff8c00" },
			{ name: "Orange Bright", hash: "#f7630c" },
			{ name: "Orange_Dark", hash: "#ca5010" },
			{ name: "Rust", hash: "#da3b01" },
			{ name: "Pale_Rust", hash: "#ef6950" },
			{ name: "Brick Red", hash: "#d13438" },
			{ name: "Mod Red", hash: "#ff4343" },
			{ name: "Pale Red", hash: "#e74856" },

			{ name: "Red", hash: "#e81123" },
			{ name: "Rose Bright", hash: "#ea005e" },
			{ name: "Rose", hash: "#c30052" },
			{ name: "Plum Light", hash: "#e3008c" },
			{ name: "Plum", hash: "#bf0077" },
			{ name: "Orchid Light", hash: "#c239b3" },
			{ name: "Orchid", hash: "#9a0089" },
			{ name: "Blue", hash: "#0078d4" },
			{ name: "Navi Blue", hash: "#0063b1" },

			{ name: "Purple Shadow", hash: "#8e8cd8" },
			{ name: "Purple Shadow Dark", hash: "#6b69d6" },
			{ name: "Iris Pastel", hash: "#8764b8" },
			{ name: "Iris Spring", hash: "#744da9" },
			{ name: "Violet Red Light", hash: "#b146c2" },
			{ name: "Violet Red", hash: "#881798" },
			{ name: "Cool Blue Bright", hash: "#0099bc" },
			{ name: "Cool Blue", hash: "#2d7d9a" },
			{ name: "Seafoam", hash: "#2d7d9a" },

			{ name: "Seafoam Teal", hash: "#038387" },
			{ name: "Mint Light", hash: "#00b294" },
			{ name: "Mint Dark", hash: "#018574" },
			{ name: "Turf Green", hash: "#00cc6a" },
			{ name: "Sport Green", hash: "#10893e" },
			{ name: "Gray", hash: "#7a7574" },
			{ name: "Gray Brown", hash: "#5d5a58" },
			{ name: "Steel_Blue", hash: "#68768a" },
			{ name: "Metal Blue", hash: "#515c6b" },

			{ name: "Pale Moss", hash: "#567c73" },
			{ name: "Moss", hash: "#486860" },
			{ name: "Meadow Green", hash: "#498205" },
			{ name: "Green", hash: "#107c10" },
			{ name: "Overcast", hash: "#767676" },
			{ name: "Storm", hash: "#4c4a48" },
			{ name: "Blue Gray", hash: "#69797e" },
			{ name: "Gray Dark", hash: "#4a5459" },
			{ name: "Liddy Green", hash: "#647c64" },

			{ name: "Sage", hash: "#525e54" },
			{ name: "Camouflage Desert", hash: "#847545" },
			{ name: "Camouflage", hash: "#7e735f" },
		];
	}

	override onCreate(): void {
		super.onCreate();
	}

	override onViewInit(): void {
		super.onViewInit();
		AppService.setTitle(Language.language.Setting_Page_Title);

		
		this.switchAudio = new Switch(document.getElementById("Setting_Switch_Audio_Container"));
		this.switchAudio.checked = SettingController.getAudioStatus();
		this.switchAudio.setOnClickListener(() => {
			this.onClickAudioSwitch();
		});

		this.volumeValue = <HTMLParagraphElement>document.getElementById("Setting_Volume_Value");
		this.volumeValue.innerText = SettingController.getVolume() + "";

		this.btnThemeLight = new Button(document.getElementById("Setting_Button_Theme_Light"));
		this.btnThemeDark = new Button(document.getElementById("Setting_Button_Theme_Dark"));
		this.btnThemeNavy = new Button(document.getElementById("Setting_Button_Theme_Navy"));
		this.btnThemeCosmic = new Button(document.getElementById("Setting_Button_Theme_Cosmic"));
		const btnLanguageEn: Button = new Button(document.getElementById("Setting_Button_Language_En"), true);
		const btnLanguageFa: Button = new Button(document.getElementById("Setting_Button_Language_Fa"), true);

		this.btnThemeLight.setColor("#2595ec");
		this.btnThemeDark.setColor("#717171");
		this.btnThemeNavy.setColor("#3663e2");
		this.btnThemeCosmic.setColor("#945eff");


		const volumeSeekbarElement: HTMLDivElement = <HTMLDivElement>document.getElementById("Setting_Volume_Seekbar");
		const seekbar: SeekBar = new SeekBar(volumeSeekbarElement, true, true, SettingController.getVolume(), 0, 100, 1);
		seekbar.onInputChange((value) => {
			this.onSoundVolumeSeekBarChange(value);
		});



		const btnColorLight: Button = new Button(document.getElementById("Setting_Button_Color_Default"));
		btnColorLight.addOnClickListener(() => {
			this.inputSelectColor.value = UI.getCssVariable(UI.mainElement, "basic-color");
			SettingController.setDeafultCssVariables();
		});
		this.inputSelectColor = <HTMLInputElement>document.getElementById("Setting_Button_Color_Select");
		this.inputSelectColor.value = Storage.getString(Storage.Setting, "color", UI.getCssVariable(UI.mainElement, "basic-color"));
		this.inputSelectColor.addEventListener("change", (e: Event) => {
			this.onColorChange(e);
		});
		//this.btnColorDefault.setColor(UI.getCssVariable("button-background-color"));


		const colorButtonsContainer: HTMLDivElement = <HTMLDivElement>document.getElementById("Setting_Color_Buttons_Container");
		Setting.Colors.forEach((color: any) => {
			let button: Button = new Button(colorButtonsContainer, false);
			button.element.style.width = "50px";
			button.element.style.height = "50px";
			button.getElement().title = color.name;
			button.setColor(color.hash);
			button.addOnClickListener(() => {
				this.onClickColorsButton(color.hash)
			});
		});


		/*this.subscriptions.add(
			Setting.settingSubject.subscribe((action: string) => {
				if (action === "onClickCliClose") {
					this.onClickCliClose();
				}
			})
		);
		*/

		this.changeTheme(SettingController.theme);

		this.btnThemeLight.addOnClickListener(() => {
			this.changeTheme(SettingController.THEME_LIGHT);
		});
		this.btnThemeDark.addOnClickListener(() => {
			this.changeTheme(SettingController.THEME_DARK);
		});
		this.btnThemeNavy.addOnClickListener(() => {
			this.changeTheme(SettingController.THEME_NAVY);
		});
		this.btnThemeCosmic.addOnClickListener(() => {
			this.changeTheme(SettingController.THEME_COSMIC);
		});
		btnLanguageEn.addOnClickListener(() => {
			this.changeLanguage("en");
		});
		btnLanguageFa.addOnClickListener(() => {
			this.changeLanguage("fa");
		});

		var languageName: string = SettingController.language;
		if (languageName === "en") {
			btnLanguageEn.getElement().classList.add("button-select");
			btnLanguageEn.setDisable(true);
		} else if (languageName === "fa") {
			btnLanguageFa.getElement().classList.add("button-select");
			btnLanguageFa.setDisable(true);
		}

	}


	override onDestroy(): void {
		super.onDestroy();
	}





	public changeTheme(theme: string) {

		if (this.btnThemeLight != null) {
			this.btnThemeLight.getElement().classList.remove("button-select");
			this.btnThemeLight.setDisable(false);
		}
		if (this.btnThemeDark != null) {
			this.btnThemeDark.getElement().classList.remove("button-select");
			this.btnThemeDark.setDisable(false);
		}
		if (this.btnThemeNavy != null) {
			this.btnThemeNavy.getElement().classList.remove("button-select");
			this.btnThemeNavy.setDisable(false);
		}
		if (this.btnThemeCosmic != null) {
			this.btnThemeCosmic.getElement().classList.remove("button-select");
			this.btnThemeCosmic.setDisable(false);
		}

		if (theme === SettingController.THEME_LIGHT) {
			this.btnThemeLight.getElement().classList.add("button-select");
			this.btnThemeLight.setDisable(true);

		} else if (theme === SettingController.THEME_DARK) {
			this.btnThemeDark.getElement().classList.add("button-select");
			this.btnThemeDark.setDisable(true);

		} else if (theme === SettingController.THEME_NAVY) {
			this.btnThemeNavy.getElement().classList.add("button-select");
			this.btnThemeNavy.setDisable(true);

		} else if (theme === SettingController.THEME_COSMIC) {
			this.btnThemeCosmic.getElement().classList.add("button-select");
			this.btnThemeCosmic.setDisable(true);

		} else {
			theme = "light";
			this.btnThemeLight.getElement().classList.add("button-select");
			this.btnThemeLight.setDisable(true);
		}


		if (theme === SettingController.theme) {
			return;
		}

		SettingController.setTheme(theme);
	}

	public changeLanguage(name: string) {
		//Setting.put("Language", name);
		// window.location.reload();
		window.location.href = window.location.protocol + '//' + window.location.host + "/" + name + "/setting";
	}



	/*public onClickCliSwitch(): void {
		if (this.switchCli.checked) { // Active
			Cli.cliLayerSubject.next("Show");
		} else {// Deactive
			Cli.cliLayerSubject.next("None");
		}
	}

	private onClickCliClose(): void {
		this.render.setProperty(this.switchCli, "checked", false);
		Cli.cliLayerSubject.next("None");
	}
		*/


	public onClickAudioSwitch(): void {
		if (this.switchAudio.checked) {
			SettingController.setAudioStatus(true);
		} else {
			SettingController.setAudioStatus(false);
		}
	}

	public onSoundVolumeSeekBarChange(value: number): void {
		SettingController.setVolume(value);
		this.volumeValue.innerText = value + "";
}

	private onClickColorsButton(color: string): void {
		SettingController.setNewCssVariables(color);
		this.inputSelectColor.value = color;
	}

	private onColorChange(e: Event): void {
		this.onClickColorsButton((e.target as HTMLInputElement).value);
	}


}
