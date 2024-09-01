import { ListnerDelegate } from "../ListnerDelegate";
import { ILanguage } from "./ILanguage";

export abstract class Language {
	
	public static language: ILanguage;
	public static setLanguage(language: string): void {
		if (language === "fa") {
			import(/* webpackMode: "lazy", webpackChunkName: "language_fa" */ "./Language_FA").then(module => {
				Language.language = new module.default;
				ListnerDelegate.publish(ListnerDelegate.LISTNER_LANGUAGE, language);
			});
		} else {
			//Language.language = new LanguageEN();
			import(/* webpackMode: "lazy", webpackChunkName: "language_en" */ "./Language_EN").then(module => {
				Language.language = new module.default;
				ListnerDelegate.publish(ListnerDelegate.LISTNER_LANGUAGE, language);
			});

		}
	}


}
