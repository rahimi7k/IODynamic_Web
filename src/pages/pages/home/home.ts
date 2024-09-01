import html from './home.html'
import "./home.scss";
import { Page } from "../Page";
import { PopUp } from "../../component/popup/popup";
import { Select } from "../../component/select/select";
import { ArrayList } from "../../../core/Utils/ArrayList";
import { Toast } from "../../component/toast/toast";
import { ListnerDelegate } from "../../../core/ListnerDelegate";
import { Button } from "../../component/button/button";
import { Color } from '../../ui/Color';
import { SettingController } from '../setting/setting.controller';
import { Language } from '../../../core/Language/Language';
import { Router } from '../../../core/Router';
import { AppService } from '../../../core/AppService';

export class Home extends Page {


	private btnFollowergirApp: Button;
	private btnFollowergirBuy: Button;
	private btnFollowergirDescription: Button;
	private btnMembergirApp: Button;
	private btnMembergirBuy: Button;
	private btnMembergirDescription: Button;



	constructor(parentElement: HTMLElement) {
		super(parentElement, "Home", html);
	}

	public override onCreate(): void {
		super.onCreate();
		console.log("Home onCreate Called!");

	}


	public override onViewInit(): void {
		super.onViewInit();
		AppService.setTitle(Language.language.Home_Page_Title);

		console.log("Home onView Called!");


		this.btnFollowergirApp = new Button(document.getElementById("Home_Followergir_App"));
		this.btnFollowergirBuy = new Button(document.getElementById("Home_Followergir_Buy"));
		this.btnFollowergirDescription = new Button(document.getElementById("Home_Followergir_Description"));
		this.btnMembergirApp = new Button(document.getElementById("Home_Membergir_App"));
		this.btnMembergirBuy = new Button(document.getElementById("Home_Membergir_Buy"));
		this.btnMembergirDescription = new Button(document.getElementById("Home_Membergir_Description"));



		this.btnFollowergirApp.element.style.width = "140px";
		this.btnFollowergirBuy.element.style.width = "140px";
		this.btnFollowergirDescription.element.style.width = "140px";

		this.btnFollowergirApp.setColor(Color.Color.BlueSky);
		this.btnFollowergirBuy.setColor(Color.Color.Green);
		this.btnFollowergirDescription.setColor(Color.Color.Purple);


		this.btnFollowergirDescription.addOnClickListener(() => {
			Router.navigate("/" + SettingController.language + "/applications/followergir");
		});

		this.btnFollowergirBuy.addOnClickListener(() => {
			Router.navigate("/" + SettingController.language + "/shop");
		});

		this.btnFollowergirApp.addOnClickListener(() => {
			window.location.href = "https://followergir.iodynamic.com";
		});


		this.btnMembergirApp.element.style.width = "140px";
		this.btnMembergirBuy.element.style.width = "140px";
		this.btnMembergirDescription.element.style.width = "140px";

		this.btnMembergirApp.setColor(Color.Color.BlueSky);
		this.btnMembergirBuy.setColor(Color.Color.Green);
		this.btnMembergirDescription.setColor(Color.Color.Purple);

		this.btnMembergirApp.addOnClickListener(() => {
			// window.location.href = "https://membergir.iodynamic.com";
			Toast.show(Toast.STATUS_DEFAULT, Language.language.Home_On_Working);
		});

		this.btnMembergirBuy.addOnClickListener(() => {
			Toast.show(Toast.STATUS_DEFAULT, Language.language.Home_On_Working);
		});

		this.btnMembergirDescription.addOnClickListener(() => {
			Router.navigate("/" + SettingController.language + "/applications/membergir");
		});











		ListnerDelegate.add(this, ListnerDelegate.LISTNER_LANGUAGE);



		/*var button: Button = new Button(<HTMLButtonElement>document.getElementById("Home_Button"), true);
		button.show();
		button.addOnClickListener(() => {
			//var popup: PopUp = new PopUp(this.dynamicElement, true);
			//popup.show();
			Toast.show(1, "asd");
		});
		*/
		/*
				let defaultItem: Select.Item = new Select.Item("1", "Text", null);
				let Item1: Select.Item = new Select.Item("1", "Text", null);
				let Item2: Select.Item = new Select.Item("2", "Text2", null);
				let Item3: Select.Item = new Select.Item("3", "Text3", null);
				let Item4: Select.Item = new Select.Item("4", "Text4", null);
				let Item5: Select.Item = new Select.Item("5", "Text5", null);
				let Item6: Select.Item = new Select.Item("6", "Text6", null);
				let Item7: Select.Item = new Select.Item("7", "Text7", null);
				let items: ArrayList<Select.Item> = new ArrayList<Select.Item>();
				items.add(Item1);
				items.add(Item2);
				items.add(Item3);
				items.add(Item4);
				items.add(Item5);
				items.add(Item6);
				items.add(Item7);
				var select: Select = new Select(document.getElementById("Home_Select"), true, defaultItem, items);
		*/

		/*setTimeout(() => {
			console.log("EJRA SHOOD");
			document.removeChild(<HTMLButtonElement>document.getElementById("Home_Button"));
		}, 3000);*/


	}


	public override onDestroy(): void {
		super.onDestroy();

	}


	public onEvent(id: number, ...args: Object[]): void {
		super.onEvent(id, ...args);

	}


}
