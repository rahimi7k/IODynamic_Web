import html from './api.html'
import "./api.scss";
import { Page } from "../Page";
import { Language } from '../../../core/Language/Language';
import { AppService } from '../../../core/AppService';

export class Api extends Page {


	public responseOrderMember: string = `{"status": "ok", "order_count": 75, "coin": 125.38, "id": 1995}`;
	public responseOrderLike: string = `{"status": "ok", "order_count": 75, "coin": 125.38, "id": 2005}`;
	public responseOrderComment: string = `{"status": "ok", "order_count": 75, "coin": 125.38, "id": 2022}`;
	public responseGetCredit: string = `{"status": "ok", "coin": 65.4}`;
	public responseGetOrder: string = `{"status": "ok", "order_count": 75, "remained": 65, error:""}`;
	public commentList: string = `["You look good today", "Greate", "Love You", "Best", "My best friend", "Fantastic", "Nice", "I like you", "Beautiful", "You are lovely"]`;
	public responseCancelOrder: string = `{"status": "ok", "coin": 65.4, "order_count": 75, "remained": 65}`;




	constructor(parentElement: HTMLElement) {
		super(parentElement, "Api", html);
	}


	override onCreate(): void {
		super.onCreate();
	}


	override onViewInit(): void {
		super.onViewInit();
		AppService.setTitle(Language.language.Api_Page_Title);


		document.getElementById("Api_Response_GetCredit").innerText = `{"status": "ok", "coin": 65.4}`;
		document.getElementById("Api_Response_Order_Member").innerText = `{"status": "ok", "order_count": 75, "coin": 125.38, "id": 1995}`;
		document.getElementById("Api_Response_Order_Like").innerText = `{"status": "ok", "order_count": 75, "coin": 125.38, "id": 2005}`;
		document.getElementById("Api_Response_Order_Comment").innerText = `{"status": "ok", "order_count": 75, "coin": 125.38, "id": 2022}`;
		document.getElementById("Api_Response_Get_Order").innerText = `{"status": "ok", "order_count": 75, "remained": 65, error:""}`;
		document.getElementById("Api_Comment_List").innerText = `["You look good today", "Greate", "Love You", "Best", "My best friend", "Fantastic", "Nice", "I like you", "Beautiful", "You are lovely"]`;
		document.getElementById("Api_Response_Cancel_Order").innerText = `{"status": "ok", "coin": 65.4, "order_count": 75, "remained": 65}`;


	}



	override onDestroy(): void {
		super.onDestroy();

	}




}

