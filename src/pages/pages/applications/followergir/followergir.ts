import html from './followergir.html'
import "./followergir.scss";
import { Page } from "../../Page";
import { Language } from '../../../../core/Language/Language';
import { AppService } from '../../../../core/AppService';



export class Followergir extends Page {

	constructor(parentElement: HTMLElement) {
		super(parentElement, "Followergir", html);
	}


	override onCreate(): void {
		super.onCreate();

	}

	override onViewInit(): void {
		super.onViewInit();
		AppService.setTitle(Language.language.FollowergirPage_Page_Title);

	}





	public onClickDownload(): void {
		var downloadElement: HTMLDivElement = <HTMLDivElement>document.getElementById("Followergir_Download");

		downloadElement.scrollIntoView({
			behavior: "smooth",
			block: "start",
			inline: "nearest",
		});
	}
}
