import { ListnerDelegate } from "../../core/ListnerDelegate";
import { Listner } from "../../core/Listner";
import { Interval } from "../../core/Utils/Interval";
import { JSONObject } from "../../core/Utils/Json";
import { Language } from "../../core/Language/Language";
import { StringUtils } from "../../core/Utils/StringUtils";

export abstract class Component implements Listner.IListner {

	public static readonly HTML_TYPE_DIV: string = "div";
	public static readonly HTML_TYPE_BUTTON: string = "button";
	public static readonly HTML_TYPE_INPUT: string = "input";
	public static readonly HTML_TYPE_TEXT_AREA: string = "textarea";

	public element: HTMLElement;
	public isOnViewCalled: boolean = false;


	constructor(parentElement: HTMLElement, id: string = null, html: string = "", isStatic: boolean = true, type: string = Component.HTML_TYPE_DIV) {
		this.onCreate();

		if (isStatic) {
			this.element = parentElement;
		} else {
			this.element = document.createElement(type);
			parentElement.appendChild(this.element);
		}
		if (!StringUtils.isEmpty(id)) {
			this.element.id = id;
		}


		if (StringUtils.isEmpty(html)) {
			new Interval(() => {
				if (Language.language == null) {
					return false;
				}
				this.onViewInit();
				return true;
			}, 50, 400);//20 seconds

		} else {
			const callback: MutationCallback = (mutationList: MutationRecord[], observer: MutationObserver) => {
				for (const mutation of mutationList) {
					if (mutation.type === "childList") {
						//console.log("id: " + id + " - mutationList", mutationList);
						for (let i: number = 0; i < mutation.addedNodes.length; i++) {
							var addedElement: HTMLElement = mutation.addedNodes[0] as HTMLElement;
							if (addedElement != null && addedElement.parentElement.id === id) {
								observer.disconnect();
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
			observer.observe(this.element, config);


			new Interval(() => {
				if (Language.language == null) {
					return false;
				}
				//parentElement.innerHTML = this.htmlEditor(html);
				this.element.insertAdjacentHTML("afterbegin", this.htmlEditor(html));
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



	}



	public onCreate(): void {

	}

	public onViewInit(): void {

	}

	public onDestroy(): void {

		this.element.remove();

	}

	public onEvent(id: number, ...args: Object[]): void {

	}




	private htmlEditor(html: string): string {
		//console.log(Language.language["AND"]); // javascript - Call Function based on String
		html = html.replace(/{{(.*?)}}/gm, (variable1: string, variable2: string): string => {
			return (<any>Language.language)[variable2];
		});
		return html;
	}



	public isUIReady(): Promise<void> {
		return new Promise<void>((resolve) => {
			new Interval(() => {
				if (this.isOnViewCalled) {
					resolve();
					return true;
				}

				return false;
			});
		});
	}




}