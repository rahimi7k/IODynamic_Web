import html from './contact-us.html'
import "./contact-us.scss";
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
import { WebObject } from '../../../core/IONet/WebObject';
import { Toast } from '../../component/toast/toast';
import { Input } from '../../component/input/input';



export class ContactUs extends Page {

	private nameInput: Input;
	private emailInput: Input;
	private subjectInput: Input;
	private messagetInput: Input;
	private sendTicketButton: Button;



	constructor(parentElement: HTMLElement) {
		super(parentElement, "ContactUs", html);
	}

	override onCreate(): void {
		super.onCreate();
	}

	override onViewInit(): void {
		super.onViewInit();
		AppService.setTitle(Language.language.ContactUs_Page_Title);

		this.nameInput = new Input(<HTMLInputElement>document.getElementById("ContactUs_Input_Name"));

		this.emailInput = new Input(<HTMLInputElement>document.getElementById("ContactUs_Input_Email"));
		this.subjectInput = new Input(<HTMLInputElement>document.getElementById("ContactUs_Input_Subject"));
		this.messagetInput = new Input(<HTMLInputElement>document.getElementById("ContactUs_Input_Message"), true, null, false, null, true);

		this.subjectInput.element.classList.add(SettingController.direction);
		this.messagetInput.element.classList.add(SettingController.direction);

		this.sendTicketButton = new Button(<HTMLButtonElement>document.getElementById("ContactUs_Button_Send"));
		this.sendTicketButton.addOnClickListener(() => {
			this.SendTicket();
		});


	}



	public async SendTicket(): Promise<void> {

		this.sendTicketButton.lock = true;

		if (this.emailInput.element.value === "") {
			this.sendTicketButton.lock = false;
			Toast.show(Toast.STATUS_ERROR, Language.language.ContactUs_Hint_Email_Empty);
			return;
		} else if (!StringUtils.validateEmail(this.emailInput.element.value)) {
			this.sendTicketButton.lock = false;
			Toast.show(Toast.STATUS_ERROR, Language.language.ContactUs_Hint_Email_Invalid);
			return;
		} else if (this.subjectInput.element.value === "") {
			this.sendTicketButton.lock = false;
			Toast.show(Toast.STATUS_ERROR, Language.language.ContactUs_Hint_Subject_Empty);
			return;
		} else if (this.messagetInput.element.value === "") {
			this.sendTicketButton.lock = false;
			Toast.show(Toast.STATUS_ERROR, Language.language.ContactUs_Hint_Message_Empty);
			return;
		}


		var req: WebObject.EmailSupport = new WebObject.EmailSupport;
		req.name = this.nameInput.element.value;
		req.application = "Followergir";
		req.header = this.subjectInput.element.value;
		req.message = this.messagetInput.element.value;
		req.email = this.emailInput.element.value;
		req.os = "Web";
		req.version = AppService.version;

		var res: WebObject.EmailSupportResponse = await Network.requestPost("https://web.iodynamic.com/send_mail", JSON.stringify(req), null, "json", "json");
		console.log(res);

		if (res == null) {
			Toast.show(Toast.STATUS_ERROR, Language.language.Toast_Content_Ticket_NotSend);

		} else {

			if (res.ok === true) {

				this.nameInput.element.value = "";
				this.subjectInput.element.value = "";
				this.messagetInput.element.value = "";
				this.emailInput.element.value = "";
				Toast.show(Toast.STATUS_SUCCESS, Language.language.Toast_Title_Ticket + "<br\>" + Language.language.Toast_Content_Ticket);


				/*
				this.renderer.setProperty(this.captchaImage, 'src', 'assets/images/ic_lost_clock.gif');
				var audio = new Audio('assets/audio/au_lost_countdown.mp3');
				audio.play();
	
				setTimeout(() => {
				  audio = new Audio('assets/audio/au_lost_alarm.mp3');
				  audio.play();
				  setTimeout(() => {
					audio = new Audio('assets/audio/au_lost_alarm.mp3');
					audio.play();
				  }, 1000);
				}, 6100);
	
				setTimeout(() => {
				  this.captchaImage.style.visibility = "hidden";
				  this.captchaImage.style.height = "100px";
				  this.renderer.setProperty(this.captchaImage, 'src', 'assets/images/ic_lost_computer.gif');
				  setTimeout(() => {
					this.captchaImage.style.visibility = "visible";
					setTimeout(async () => {
					  this.captchaImage.style.visibility = "hidden";
					  await this.renderer.setProperty(this.captchaImage, 'src', "http://localhost:3344/captcha/CreateCaptcha" + "?" + new Date().getTime());
					  this.captchaImage.style.height = "70px";
					  setTimeout(() => {
						this.captchaImage.style.visibility = "visible";
						this.nameInput.value = "";
						this.emailInput.value = "";
						this.subjectInput.value = "";
						this.messagetInput.value = "";
						this.captchatInput.value = "";
	
						// Toast.show(this.lang["Toast_Title_Ticket"], this.lang["Toast_Content_Ticket"], "primary");
					  }, 200);
					}, 8040);
				  }, 100);
	
				}, 7810);
				*/

			} else {

				if (res.description === "PARAMETER_IS_MISSING") {
					Toast.show(Toast.STATUS_ERROR, Language.language.Toast_Title_Ticket_NotSend + " < br\>" + Language.language.Toast_Content_Ticket_NotSend);

				} else if (res.description === "TOO_MANY_ATTEMPT") {
					Toast.show(Toast.STATUS_ERROR, Language.language.Toast_Ticket_Too_Many_Attemp);
				}
			}

		}

		this.sendTicketButton.lock = false;
	}



}

