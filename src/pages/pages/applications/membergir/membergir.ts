import html from './membergir.html'
import "./membergir.scss";
import { Page } from "../../Page";
import { Language } from '../../../../core/Language/Language';
import { AppService } from '../../../../core/AppService';



export class Membergir extends Page {

	constructor(parentElement: HTMLElement) {
		super(parentElement, "Membergir", html);
	}


	override onCreate(): void {
		super.onCreate();

	}

	override onViewInit(): void {
		super.onViewInit();
		AppService.setTitle(Language.language.MembergirPage_Page_Title);

	}





	public onClickDownload(): void {
		var downloadElement: HTMLDivElement = <HTMLDivElement>document.getElementById("Membergir_Download");

		downloadElement.scrollIntoView({
			behavior: "smooth",
			block: "start",
			inline: "nearest",
		});
	}
}
