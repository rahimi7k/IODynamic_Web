import { AppService } from "./core/AppService";
import { Language } from "./core/Language/Language";
import {Pages} from "./pages/Pages";
import { SettingController } from "./pages/pages/setting/setting.controller";
import { IndexDBHandler } from "./core/IndexDB/IndexDBHandler";
import { Storage } from "./core/Utils/Storage";


export class Main {

	public static readonly MAIN_ELEMENT_ID: string = "Main";


	constructor() {
		const mainElement: HTMLDivElement = <HTMLDivElement>document.getElementById(Main.MAIN_ELEMENT_ID);
		AppService.initialize();
		if (window.location.pathname.startsWith("/fa/")) {
			Language.setLanguage("fa");
			Storage.put(Storage.Setting, "Language", "fa");
		} else if (window.location.pathname.startsWith("/en/")) {
			Language.setLanguage("en");
			Storage.put(Storage.Setting, "Language", "en");
		} else {
			Language.setLanguage(SettingController.language);
		}

		IndexDBHandler.init();


		new Pages(mainElement);
	}


}



new Main();


/*
document.addEventListener("DOMContentLoaded", () => {  });
document.addEventListener("load", () => {  });

async
<script src="path/to/script1.js" async></script>
<script src="path/to/script2.js" async></script>
Scripts with the async attribute are executed asynchronously. This means the script is executed as soon as it's downloaded, without blocking the browser in the meantime.
 This implies that it's possible that script 2 is downloaded and executed before script 1.

defer
<script src="path/to/script1.js" defer></script>
<script src="path/to/script2.js" defer></script>
Scripts with the defer attribute are executed in order (i.e. first script 1, then script 2). This also does not block the browser.
Unlike async scripts, defer scripts are only executed after the entire document has been loaded.
*/
