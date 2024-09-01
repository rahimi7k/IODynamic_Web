import html from './shop.html'
import "./shop.scss";
import { StringUtils } from "../../../core/Utils/StringUtils";
import { Button } from "../../component/button/button";
import { Page } from "../Page";
import { AppService } from '../../../core/AppService';
import { Language } from '../../../core/Language/Language';
import { SettingController } from '../setting/setting.controller';
import { JSONObject } from '../../../core/Utils/Json';
import { Network } from '../../../core/Network';
import { PopUp } from '../../component/popup/popup';
import { Color } from '../../ui/Color';



export class Shop extends Page {

	private static packagesList: JSONObject;
	private static rateConfig: Shop.RateConfig;
	public isPackageLoaded: boolean = false;

	private storePackagesContainer: HTMLDivElement;
	private storePackagesEmptyContainer: HTMLDivElement;
	private packageFreeElement: HTMLDivElement;


	//@ViewChild("Shop_PaymentButton_Free") buttonFree: ButtonComponent;
	//@ViewChildren("Shop_PaymentButton") buttonsQueryList: QueryList<ButtonComponent>;



	constructor(parentElement: HTMLElement) {
		super(parentElement, "Shop", html);
	}

	override onCreate(): void {
		super.onCreate();
	}


	override onViewInit(): void {
		super.onViewInit();
		AppService.setTitle(Language.language.Shop_Page_Title);


		/*this.buttonsQueryList.changes.subscribe((value: QueryList<ButtonComponent>) => {

			this.buttonFree.setColor(Color.Color.Green);
			this.buttonFree.setOnClickListener(() => {
				this.showPopUp(1000);
			});

			this.buttons = value.toArray();
			for (let i: number = 0; i < this.buttons.length; i++) {
				this.buttons[i].setOnClickListener(() => {
					this.showPopUp(i);
				});
			}
		});*/


		this.storePackagesContainer = <HTMLDivElement>document.getElementById("Store_Packages_Container");
		this.storePackagesEmptyContainer = <HTMLDivElement>document.getElementById("Store_Packages_Empty_Container");
		this.packageFreeElement = <HTMLDivElement>document.getElementById("Shop_Package_Free");


		const buttonPackageFree: Button = new Button(document.getElementById("Shop_PaymentButton_Free"), true);
		buttonPackageFree.addOnClickListener(() => {
			this.showPopUp("free");
		});



		this.clientsPrices();
	}


	override onDestroy(): void {
		super.onDestroy();
	}




	public async showPopUp(packageName: string): Promise<void> {

		var packageItem: Shop.Package = packageName === "free" ? null : this.createPackage(packageName);

		var popup: PopUp = new PopUp(this.dynamicElement);

		var container: HTMLDivElement = document.createElement("div");
		container.classList.add("payment");

		var header: HTMLDivElement = document.createElement("div");
		header.classList.add("header");
		container.appendChild(header);

		var packageImg: HTMLImageElement = document.createElement("img");
		if (packageName === "free") {
			packageImg.src = "/assets/images/shop/bag-coin.png";
		} else {
			packageImg.src = packageItem.image;
		}
		header.appendChild(packageImg);

		var titleMsg: HTMLParagraphElement = document.createElement("p");
		titleMsg.innerText = packageName === "free" ? Language.language.Shop_Package_Free : Language.language.Shop_Package + packageName;
		header.appendChild(titleMsg);

		var hr: HTMLHRElement = document.createElement("hr");
		hr.classList.add("hr");
		container.appendChild(hr);


		var body: HTMLDivElement = document.createElement("div");
		body.classList.add("body");
		container.appendChild(body);


		/*
		var dropdownContainer = this.render.createElement("dropdown-container");
		this.render.appendChild(info, dropdownContainer);
		this.render.setProperty(dropdownContainer, 'className', 'form-group dropdown-container');

		var labelDropdown = this.render.createElement("label");
		this.render.appendChild(dropdownContainer, labelDropdown);
		this.render.setProperty(labelDropdown, 'className', 'label');
		this.render.setProperty(labelDropdown, 'for', "store_popup_dropdown");
		this.render.setProperty(labelDropdown, 'innerHTML', this.language.Store_PaymentMethod);

		var dropdown = this.render.createElement("dropdown");
		this.render.appendChild(dropdownContainer, dropdown);
		this.render.setProperty(dropdown, 'className', 'dropdown');

		var select = this.render.createElement("select");
		this.render.appendChild(dropdown, select);
		this.render.setProperty(select, 'className', 'form-control dropdown-select');
		this.render.setProperty(select, 'name', 'gateway-list');
		this.render.setProperty(select, 'size', 0);
		this.render.setAttribute(select, 'onfocus', 'if(this.options.length > 5){this.size = 5}');
		this.render.setAttribute(select, 'onblur', 'this.size=0;');
		this.render.setAttribute(select, 'onchange', 'this.size=1; this.blur();');
		this.render.listen(select, 'change', (event) => { this.onItemChange(event.target.value); });

		var payWith = this.render.createElement("div");
		this.render.appendChild(info, payWith);
		this.render.setProperty(payWith, 'className', 'payWith');

		var imgpayWith = this.render.createElement("img");
		this.render.appendChild(payWith, imgpayWith);
		this.render.setProperty(imgpayWith, 'src', 'assets/images/ic_cardbank.png');

		var labelpayWith = this.render.createElement("label");
		this.render.appendChild(payWith, labelpayWith);
		this.render.setProperty(labelpayWith, 'className', 'label');
		this.render.setProperty(labelpayWith, 'innerHTML', this.language.Store_GateWay);

		var gateWayText = this.render.createElement("p");
		this.render.appendChild(payWith, gateWayText);
		this.render.setProperty(gateWayText, "id", "Store_PopUp_TextPayWith");

		if (this.languageName === "en") {
			var option1 = this.render.createElement("option");
			this.render.appendChild(select, option1);
			this.render.setProperty(option1, 'value', 1);
			this.render.setProperty(option1, 'innerHTML', this.language.Store_PaymentMethod_PerfectMoney);

			var option2 = this.render.createElement("option");
			this.render.appendChild(select, option2);
			this.render.setProperty(option2, 'value', 2);
			this.render.setProperty(option2, 'innerHTML', this.language.Store_PaymentMethod_Payeer);


			if (this.gateWay === 1) {
				this.render.setProperty(gateWayText, 'innerHTML', this.language.Store_PaymentMethod_PerfectMoney);
				this.render.setProperty(option1, 'selected', "selected");
			} else {
				this.render.setProperty(gateWayText, 'innerHTML', this.language.Store_PaymentMethod_Payeer);
				this.render.setProperty(option2, 'selected', "selected");
			}

		} else {
			var option1 = this.render.createElement("option");
			this.render.appendChild(select, option1);
			this.render.setProperty(option1, 'value', 1);
			this.render.setProperty(option1, 'innerHTML', this.language.Store_GateWay + " " + this.language.Store_PaymentMethod_ZarinPal);

			var option2 = this.render.createElement("option");
			this.render.appendChild(select, option2);
			this.render.setProperty(option2, 'value', 2);
			this.render.setProperty(option2, 'innerHTML', this.language.Store_GateWay + " " + this.language.Store_PaymentMethod_IdPay);


			if (this.gateWay === 1) {
				this.render.setProperty(gateWayText, 'innerHTML', this.language.Store_PaymentMethod_ZarinPal);
				this.render.setProperty(option1, 'selected', "selected");
			} else {
				this.render.setProperty(gateWayText, 'innerHTML', this.language.Store_PaymentMethod_IdPay);
				this.render.setProperty(option2, 'selected', "selected");
			}

		}
		*/

		var lines: HTMLDivElement = document.createElement("div");
		lines.classList.add("lines");
		body.appendChild(lines);

		var count: HTMLDivElement = document.createElement("div");
		count.classList.add("line");
		lines.appendChild(count);

		var imgCount: HTMLImageElement = document.createElement("img");
		imgCount.src = "/assets/images/ic_coin.png";
		count.appendChild(imgCount);

		var labelCount: HTMLLabelElement = document.createElement("label");
		labelCount.classList.add("label");

		labelCount.innerText = Language.language.Shop_Coin; 

		count.appendChild(labelCount);

		var textCount: HTMLParagraphElement = document.createElement("p");
		textCount.innerText = packageName === "free" ? Language.language.Shop_Package_Free_Credit : packageItem.stringCredit; 

		count.appendChild(textCount);



		var price: HTMLDivElement = document.createElement("div");
		price.classList.add("line");

		lines.appendChild(price);

		var imgCount: HTMLImageElement = document.createElement("img");
		imgCount.src = "/assets/images/ic_dollar.png";

		price.appendChild(imgCount);

		var labelPrice: HTMLLabelElement = document.createElement("label");
		labelPrice.classList.add("label");
		labelPrice.innerText = Language.language.Shop_Price; 
		price.appendChild(labelPrice);

		var textPrice: HTMLParagraphElement = document.createElement("p");
		textPrice.innerText = packageName === "free" ? Language.language.Shop_Package_Free_Price : packageItem.stringPrice + " " + Language.language.Shop_Value;

		price.appendChild(textPrice);


		var description: HTMLDivElement = document.createElement("div");
		description.classList.add("line");

		lines.appendChild(description);

		var imgdDescription: HTMLImageElement = document.createElement("img");
		imgdDescription.src = "/assets/svg/info.svg";
		description.appendChild(imgdDescription);

		var labelDescription: HTMLLabelElement = document.createElement("label");
		labelDescription.classList.add("label");
		labelDescription.innerText = Language.language.Description;

		description.appendChild(labelDescription);

		var textDescription: HTMLParagraphElement = document.createElement("p");
		if (packageName === "free") {
			textDescription.innerText = Language.language.Shop_Package_Free_Explain_Msg;
		} else {
			textDescription.innerText = Language.language.Shop_PopUp_Description;
		}
		description.appendChild(textDescription);


		var btnContainer: HTMLDivElement = document.createElement("div");
		btnContainer.classList.add();
		btnContainer.classList.add("btn-container");
		body.appendChild(btnContainer);

		const button: Button = new Button(btnContainer, false, Language.language.Shop_PopUp_Login_Button);
		button.addOnClickListener(() => {
			window.location.href = "https://followergir.iodynamic.com";

		});

		popup.setOnCloseListener(() => {
			//btnRef.destroy();
		});

		popup.append(container);
		popup.show();
	}




	private async clientsPrices() {

		if (Shop.packagesList == null) {
			var req: Map<string, string> = new Map<string, string>();
			if (SettingController.language === "fa") {
				req.set("country_code", "IR");
			} else {
				req.set("country_code", "EN");
			}
			const res: JSON = await Network.requestPost("https://store.iodynamic.com/web/get_packages", req, null, "json");
			console.log("res", res);
			const json: JSONObject = new JSONObject(res);
			Shop.packagesList = json.getJSONObject("packages");

			try {
				Shop.rateConfig = JSONObject.ConvertJsonToClass<Shop.RateConfig>(json.getJSONObject("rate"), Shop.RateConfig);

			} catch (e) {
				Shop.rateConfig.user = 0;
				Shop.rateConfig.like = 0;
				Shop.rateConfig.comment = 0;
			}
		}
		
		var keys: string[] = Shop.packagesList.keys();
		for (let i: number = 0; i < keys.length; i++) {
			this.createUIPackage(this.createPackage(keys[i]));
		}

		this.packageFreeElement.style.display = "inline-block";
		this.packageFreeElement.style.visibility = "visible";
		this.packageFreeElement.style.height = "100%";
		this.storePackagesEmptyContainer.style.visibility = "hidden";
		this.storePackagesEmptyContainer.style.height = "0";

		this.isPackageLoaded = true;
	}




	private createPackage(packageName: string): Shop.Package {
		let fixNumber: number = 0;
		if (SettingController.language === "en") {
			fixNumber = 2;
		}
		const storePackage: Shop.Package = new Shop.Package();
		storePackage.name = packageName;
		storePackage.coin = Shop.packagesList.getJSONObject(storePackage.name).getNumber("coin");
		storePackage.price = Shop.packagesList.getJSONObject(storePackage.name).getNumber("price");
		storePackage.stringCredit = StringUtils.onDigitGrouping(storePackage.coin);
		storePackage.stringPrice = StringUtils.onDigitGrouping(storePackage.price);
		storePackage.oneKPriceUser = StringUtils.onDigitGrouping((storePackage.price / (storePackage.coin / (2 * Shop.rateConfig.user)) * 1000).toFixed(fixNumber));
		storePackage.oneKPriceLike = StringUtils.onDigitGrouping((storePackage.price / (storePackage.coin / (2 * Shop.rateConfig.like)) * 1000).toFixed(fixNumber));
		storePackage.oneKPriceComment = StringUtils.onDigitGrouping((storePackage.price / (storePackage.coin / (2 * Shop.rateConfig.comment)) * 1000).toFixed(fixNumber));
		storePackage.image = "/assets/images/shop/package" + parseInt(storePackage.name) + ".png";
		return storePackage;
	}



	private createUIPackage(storePackage: Shop.Package): void {

		const box: HTMLDivElement = document.createElement("div");
		box.classList.add("box", "glass-body");
		this.storePackagesContainer.appendChild(box);

		const container: HTMLDivElement = document.createElement("div");
		container.classList.add("package", "container");
		box.appendChild(container);

		let img: HTMLImageElement = document.createElement("img");
		img.src = storePackage.image;
		img.classList.add("header_img");
		img.alt = "Store Package";
		container.appendChild(img);

		const header: HTMLHeadingElement = document.createElement("h2");
		header.classList.add("name");
		header.innerText = Language.language.Shop_Package + " " + storePackage.name;
		container.appendChild(header);

		const hr: HTMLHRElement = document.createElement("hr");
		hr.classList.add("hr");
		container.appendChild(hr);



		var tozih: HTMLDivElement = document.createElement("div");
		tozih.classList.add("tozih");
		container.appendChild(tozih);

		img = document.createElement("img");
		img.src = "/assets/images/ic_coin.png";
		img.alt = "IO Coin";
		tozih.appendChild(img);

		var text: HTMLParagraphElement = <HTMLParagraphElement>document.createElement("p");
		text.innerText = Language.language.Shop_Coin + " " + storePackage.coin;
		tozih.appendChild(text);


		tozih = document.createElement("div");
		tozih.classList.add("tozih");
		container.appendChild(tozih);

		img = document.createElement("img");
		img.src = "/assets/images/ic_dollar.png";
		img.alt = "Dollar";
		tozih.appendChild(img);

		text = <HTMLParagraphElement>document.createElement("p");
		text.innerText = Language.language.Shop_Price + " " + storePackage.price + " " + Language.language.Shop_Value;
		tozih.appendChild(text);



		tozih = document.createElement("div");
		tozih.classList.add("tozih");
		container.appendChild(tozih);

		img = document.createElement("img");
		img.src = "/assets/images/ic_user_add.png";
		img.alt = "Follower";
		tozih.appendChild(img);

		text = <HTMLParagraphElement>document.createElement("p");
		text.innerText = Language.language.Shop_OneKMember + " " + storePackage.oneKPriceUser + " " + Language.language.Shop_Value;
		tozih.appendChild(text);



		tozih = document.createElement("div");
		tozih.classList.add("tozih");
		container.appendChild(tozih);

		img = document.createElement("img");
		img.src = "/assets/images/ic_love_add.png";
		img.alt = "Like";
		tozih.appendChild(img);

		text = <HTMLParagraphElement>document.createElement("p");
		text.innerText = Language.language.Shop_OneKMember + " " + storePackage.oneKPriceLike + " " + Language.language.Shop_Value;
		tozih.appendChild(text);


		tozih = document.createElement("div");
		tozih.classList.add("tozih");
		container.appendChild(tozih);

		img = document.createElement("img");
		img.src = "/assets/images/ic_comment_add.png";
		img.alt = "Comment";
		tozih.appendChild(img);

		text = <HTMLParagraphElement>document.createElement("p");
		text.innerText = Language.language.Shop_OneKMember + " " + storePackage.oneKPriceComment + " " + Language.language.Shop_Value;
		tozih.appendChild(text);


		const btnContainer: HTMLDivElement = document.createElement("div");
		btnContainer.classList.add("button-container");
		container.appendChild(btnContainer);

		const btn: Button = new Button(btnContainer, false, Language.language.Shop_Buy);
		btn.addOnClickListener(() => {
			this.showPopUp(storePackage.name);
		});
	}



}



export namespace Shop {


	export class Package {
		public name: string;
		public coin: number;
		public price: number;
		public stringCredit: string;
		public stringPrice: string;
		public oneKPriceUser: string;
		public oneKPriceLike: string;
		public oneKPriceComment: string;
		public image: string;
	}


	export enum Status {
		Cancelled = 0,
		Done = 1,
		AlreadyDone = 2,
		Error = 3,
		Failed = 4,
		WaitingForApproval = 5,
		MoneyBacked = 6,
		PayedLess = 7,
		Unknown = 8,
	};

	export class RateConfig {
		public user: number;
		public like: number;
		public comment: number;
	}


}

