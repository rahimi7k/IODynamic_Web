import { ListnerDelegate } from "../../core/ListnerDelegate";
import { Listner } from "../../core/Listner";
import { Interval } from "../../core/Utils/Interval";
import { JSONObject } from "../../core/Utils/Json";
import { Language } from "../../core/Language/Language";
import { StringUtils } from "../../core/Utils/StringUtils";
import { SettingController } from "./setting/setting.controller";

export abstract class Page implements Listner.IListner {

	public id: string;
	public element: HTMLElement;
	public dynamicElement: HTMLDivElement;


	constructor(parentElement: HTMLElement, id: string, html: string = "") {
		this.id = id;
		this.onCreate();

		if (StringUtils.isEmpty(html)) {
			new Interval(() => {
				if (Language.language == null) {
					return false;
				}

				this.onViewInit();
				return true;
			}, 50, 400);//20 seconds

		} else {
			// Callback function to execute when mutations are observed
			const callback: MutationCallback = (mutationList: MutationRecord[], observer: MutationObserver) => {
				for (const mutation of mutationList) {
					if (mutation.type === "childList") {
						//console.log("id: " + id + " - mutationList", mutationList);
						for (let i: number = 0; i < mutation.addedNodes.length; i++) {
							var addedElement: HTMLElement = mutation.addedNodes[i] as HTMLElement;
							if (addedElement != null && addedElement.id === this.id) {
								observer.disconnect();

								this.element = addedElement;
								this.onViewInit();
								break;
							}
						}
						break;//We found the childList mutation
					}
				}
			};

			let observer: MutationObserver = new MutationObserver(callback);
			let config: MutationObserverInit = {
				childList: true,
				characterData: true,		
				subtree: true
			};
			observer.observe(parentElement, config);


			new Interval(() => {
				if (Language.language == null) {
					return false;
				}
				parentElement.insertAdjacentHTML("afterbegin", this.htmlEditor(html));
				return true;
			}, 50, 400);
		}


		//let callback: MutationCallback = (mutationList: MutationRecord[], observer: MutationObserver) => {
			//console.log("id: " + id  + " - mutationList", mutationList);
			/*for (const mutation of mutationList) {
				mutation.removedNodes.forEach((removed_node: any) => {
					if (removed_node.id === id) {
						console.log('#child has been removed, id: ' + this.id);
						observer.disconnect();
						this.onDestroy();
					}
				});
			}*/
		//};
		//let observer: MutationObserver = new MutationObserver(callback);
		//let config: MutationObserverInit = {
		//	childList: true,
			//subtree: true
		//};
		//observer.observe(parentElement, config);




	/*
 		new Promise<void>((resolve) => {
			new Interval(() => {
				console.log("Not download language yet!");
				if (Language.language == null) {
					return false;
				}

				parentElement.innerHTML = this.htmlEditor(html);
				resolve();
				return true;
			}, 50, 600);//30 seconds

		}).then(() => {
			new Interval(() => {
				console.log("id", id);
				if (document.getElementById(id)) {
					this.onViewInit();
					return true;
				}
				return false;
			});
		});
	*/

	}



	public onCreate(): void {

	}

	public onViewInit(): void {
		this.dynamicElement = document.createElement("div");
		this.dynamicElement.id = "Dynamic_Element";
		this.element.insertAdjacentElement("beforeend", this.dynamicElement);

		this.element.classList.add(SettingController.direction, "fade");
	}

	public onDestroy(): void {
		this.element.remove();
	}

	public onEvent(id: number, ...args: Object[]): void {

	}




	private htmlEditor(html: string): string {
		//console.log(Language.language["AND"]); // javascript - Call (Function - Variable) based on String
		html = html.replace(/{{(.*?)}}/gm, (variable1: string, variable2: string): string => {
			return (<any>Language.language)[variable2];
		});
		return html;
	}


}