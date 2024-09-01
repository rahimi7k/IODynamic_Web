import "./list.scss";
import { Interval } from "../../../core/Utils/Interval";
import { Component } from "../Component";
import { JSONObject } from "../../../core/Utils/Json";
import { ArrayList } from "../../../core/Utils/ArrayList";
import { StringUtils } from "../../../core/Utils/StringUtils";
import { UI } from "../../ui/UI";
import { Language } from "../../../core/Language/Language";


export class List extends Component {

	private isProcesssing: boolean = false;
	private isListComplete: boolean = false;
	private _isLoadingDelegate: boolean = false;
	private isLastBlock: boolean = true;
	private _itemBorderBottom: string = "1px solid var(--border-color)";//Only possible to use css variable var(--valueName)


	private blockSize: number = 50;
	private maximumBlock: number = 3;
	private lastScrollTop: number = 0;
	private firstIndex: number = 0;	//Display First Item Index
	private lastIndex: number = -1;


	private scrollFixerTimeout: NodeJS.Timeout;
	private containerElement: HTMLDivElement;
	private containerWaitElement: HTMLDivElement;
	private containerEmptyElement: HTMLDivElement;

	private list: ArrayList<any>;
	private creatorFunction: (index: number) => HTMLElement;
	private onLoadDelegate: () => void;


	/**
	 * Create a list
	 * @param parentElement
	 * @param list ArrayList<any> of items
	 * @param onLoadMoreItem Function to load new items when user scroll down
	 * @param isStatic True if the element is created as the parentElement or false for create a new element in parentElement, Default is true
	 */
	constructor(parentElement: HTMLElement, list: ArrayList<any>, onLoadMoreItem: () => void, isStatic: boolean = true) {
		super(parentElement, null, null, isStatic);
		this.list = list;
		this.onLoadDelegate = onLoadMoreItem;
	}


	override onCreate(): void {
		super.onCreate();
	}


	override onViewInit(): void {
		super.onViewInit();

		this.element.classList.add("list-component");

		this.element.addEventListener("scroll", this.onScroll);

		//Init
		this.reCreate();

		this.isOnViewCalled = true;
	}

	override onDestroy(): void {
		super.onDestroy();

		this.element.removeEventListener("scroll", this.onScroll);
	}


	public setCreator(func: (index: number) => HTMLElement): void {
		this.creatorFunction = func;
	}

	public get isLoadingDelegate(): boolean {
		return this._isLoadingDelegate;
	}

	public get isComplete(): boolean {
		return this.isListComplete;
	}

	public set isComplete(isComplete: boolean) {

		this.isListComplete = isComplete;
		if (isComplete) {
			this._isLoadingDelegate = false;

			if (this.list.length === 0) {
				(async () => {
					await this.isUIReady();
					this.creatEmptyContainer();
				})();
			}
		} else {
			if (this.list.length === 0) {
				(async () => {
					await this.isUIReady();
					this.createWaitContainer();
				})();
			}
		}

	}





	private createElement(index: number): HTMLElement {
		const element: HTMLElement = this.creatorFunction(index);
		element.classList.add("item");
		return element;
	}


	private onScroll: (event: any) => void = (event: any): void => {

		if (this.isProcesssing) {
			return;
		}
		this.isProcesssing = true;
		clearTimeout(this.scrollFixerTimeout);
		this.scrollFixerTimeout = null;

		if (this.element.scrollTop >= this.lastScrollTop) {
			// downscroll code

			if (this.element.scrollTop + this.element.offsetHeight > this.element.scrollHeight - 150) {

				console.log("this.isListComplete", this.isListComplete);
				console.log("this.isLoadingDelegate", this.isLoadingDelegate);
				console.log("this.list.length()", this.list.length);
				console.log("this.lastIndex", this.lastIndex);

				if (this.lastIndex < this.list.length - 1) {
					this.addNewItems();

				} else if (!this.isListComplete && !this._isLoadingDelegate) {
					this._isLoadingDelegate = true;
					if (this.onLoadDelegate != null) {
						this.onLoadDelegate();
						this.isProcesssing = false;
						return; //Prevent fix the scroll, because it will stuck in loop
					}
				} else {
					//Prevent fix the scroll, because it will stuck in loop if no above condition is met
					this.isProcesssing = false;
					return;
				}
			}

		} else {
			// upscroll code

			//console.log("scrollTop", this.element.scrollTop);
			//console.log("offsetHeight", this.element.offsetHeight);
			//console.log("scrollHeight", this.element.scrollHeight);
			if (this.element.scrollTop < 50) {
				this.addOldItems();
			}

		}

		this.lastScrollTop = this.element.scrollTop <= 0 ? 0 : this.element.scrollTop; // For Mobile or negative scrolling
		this.isProcesssing = false;

		this.scrollFixerTimeout = setTimeout(() => {
			if (this.element.scrollTop < 50) {
				console.log("Omad to fix 1")
				if (this.firstIndex > 0) {
					//this.onScroll(null);
					//if (this.firstIndex >= this.blockSize) {
					this.element.scrollTop = this.element.scrollHeight / this.maximumBlock;
					//}
				}

			} else if (this.element.scrollTop + this.element.offsetHeight > this.element.scrollHeight - 150) {
				console.log("Omad to fix 2");
				this.onScroll(null);
			}
		}, 500);
	}




	private addNewItems(): void {
		const countNewItems: number = (this.list.length - 1) - this.lastIndex;
		if (countNewItems <= 0) {
			return;
		}
		//console.log("countNewItems", countNewItems);
		const fragment: DocumentFragment = new DocumentFragment();
		for (let i: number = 0; i < Math.min(countNewItems, this.blockSize); i++) {
			this.lastIndex++;
			const element: HTMLElement = this.createElement(this.lastIndex);
			fragment.appendChild(element);
		}
		this.getBlock(true).appendChild(fragment);
	}


	private addOldItems(): void {
		//console.log("this.firstIndex", this.firstIndex);
		var oldItemFirstIndex: number = this.firstIndex - 1;
		if (oldItemFirstIndex < 0) {
			return;
		}

		const fragment: DocumentFragment = new DocumentFragment();
		this.firstIndex = Math.max(oldItemFirstIndex - this.blockSize, 0);;
		for (let i: number = this.firstIndex; i <= oldItemFirstIndex; i++) {
			const element: HTMLElement = this.createElement(i);
			fragment.appendChild(element);
		}
		this.getBlock(false).appendChild(fragment);
	}


	/**
	 * Add item in the end
	 */
	public newItemsAdded(): void {
		if (this.isLastBlock) {
			this.addNewItems();
		}
		this._isLoadingDelegate = false;
	}


	/**
	 * Add item in the first
	 * @param count The number of item has been added, default is 1
	 */
	public newItemsAddedAtFirst(count: number = 1): void {
		if (count <= 0) {
			console.error("Count of new item added in first is " + count + ", The count should be more than 1");
			return;
		}
		console.log("this.firstIndex", this.firstIndex);
		if (this.firstIndex === 0) {
			var oldItemFirstIndex: number = count - 1;

			for (let i: number = this.firstIndex; i <= oldItemFirstIndex; i++) {
				const element: HTMLElement = this.createElement(i);
				this.getBlock(false).insertAdjacentElement("afterbegin", element);
				console.log("i", i);
				this.lastIndex++;
			}
		}
	}



	/**
	 * Update element, if it shows on display
	 * @param id The id of the element, If using update, the HTMLElement should have id
	 * @param func A delegate to take action, delegate receive element as parameter
	 */
	public update(id: string, func: (element: HTMLElement) => void): void {
		const element: HTMLElement = document.getElementById(id);
		if (element != null) {
			func(element);
		}
	}


	/**
	 * Remove the item from display
	 * @param index Index of the item in the list
	 * @param id The id of the element, If you want to use remove, the HTMLElement should have id
	 */
	public remove(index: number, id: string): void {
		const element: HTMLElement = document.getElementById(id);
		var parentBlock: HTMLDivElement;
		if (element != null) {
			parentBlock = element.parentElement as HTMLDivElement;
			element.remove();
		}

		if (this.firstIndex !== 0 && this.firstIndex >= index) {
			this.firstIndex--;
		}
		this.lastIndex--;


		//Remove Block when has no item
		if (parentBlock != null && parentBlock.childElementCount === 0) {
			parentBlock.remove();
		}

		//Check Few items and Last Block
		if (this.element.scrollWidth < this.element.clientWidth * 2) {
			let countItems: number = 0;
			for (let i: number = 0; i < this.containerElement.childElementCount; i++) {
				countItems += this.containerElement.children[i].childElementCount;
			}


			if (!this.isLastBlock && this.lastIndex === countItems - 1) {	//Items in display is as size as lastIndex, so we are in last block
				this.isLastBlock = true;
			}



			if (countItems < this.blockSize) {
				//We are at First of the list
				if (this.firstIndex === 0) {

					if (!this.isLastBlock) {
						this.addNewItems();

					} else {	//We are in first and we have no item, check wheater we can get more item to show
						if (!this.isListComplete && !this._isLoadingDelegate) {
							this._isLoadingDelegate = true;
							if (this.onLoadDelegate != null) {
								this.onLoadDelegate();
							}
						}
					}


					//We are at End of the list or middle
				} else {
					this.addOldItems();
				}
			}
		}

	}


	public reCreate(list?: ArrayList<any>): void {
		if (this.containerWaitElement != null) {
			this.containerWaitElement.remove();
			this.containerWaitElement = null;
		}
		if (this.containerElement != null) {
			this.containerElement.remove();
			this.containerElement = null;
		}

		this.lastScrollTop = 0;
		this.firstIndex = 0;
		this.lastIndex = -1;
		this.isLastBlock = true;

		if (list != null) {
			this.list = list;
		}

		if (this.list.length > 0) {
			const fragment: DocumentFragment = new DocumentFragment();
			for (let i: number = 0; i < Math.min(this.list.length, this.blockSize); i++) {
				const element: HTMLElement = this.createElement(i);
				fragment.appendChild(element);
				this.lastIndex = i;
			}
			this.getBlock(false).appendChild(fragment);

		} else {
			this.createWaitContainer();
		}

	}


	public get itemBorderBottom(): string {
		return this._itemBorderBottom;
	}

	public set itemBorderBottom(borderBotton: string) {
		this._itemBorderBottom = borderBotton;
	}

	public hideItemBorderBottom(): void {
		this._itemBorderBottom = "none";
	}






	private getBlock(lastBlock: boolean): HTMLDivElement {
		if (this.containerElement == null) {
			this.createListContainer();
			UI.setCssVariable(this.containerElement, "itemBorderBottom", this._itemBorderBottom);
		}

		if (this.containerElement.childElementCount === 0) {

			if (this.list.length > this.blockSize) {
				this.isLastBlock = false; //More Item remained, and it is not last block anymore
			}

			const itemBlock: HTMLDivElement = document.createElement("div");
			itemBlock.classList.add("item-block");
			this.containerElement.appendChild(itemBlock);
			return itemBlock;

		} else {
			if (lastBlock) {
				if (this.containerElement.lastElementChild.childElementCount < this.blockSize) {
					return <HTMLDivElement>this.containerElement.lastChild;
				}

				const itemBlock: HTMLDivElement = document.createElement("div");
				itemBlock.classList.add("item-block");
				this.containerElement.appendChild(itemBlock);

				//Check Reached the last item, so we are in last block
				if (this.lastIndex === this.list.length - 1) {
					this.isLastBlock = true;
				}

				//Check Maximum block at first
				if (this.containerElement.childElementCount > this.maximumBlock) {
					this.firstIndex += this.containerElement.firstElementChild.childElementCount;
					this.containerElement.firstElementChild.remove();
				}

				return itemBlock;

			} else {
				if (this.containerElement.firstElementChild.childElementCount < this.blockSize) {
					return <HTMLDivElement>this.containerElement.firstElementChild;
				}

				const itemBlock: HTMLDivElement = document.createElement("div");
				itemBlock.classList.add("item-block");
				this.containerElement.insertAdjacentElement("afterbegin", itemBlock);

				//Check maximum block at last
				if (this.containerElement.childElementCount > this.maximumBlock) {
					this.lastIndex -= this.containerElement.lastElementChild.childElementCount;
					this.isLastBlock = false;	//We are not in last block anymore
					this.containerElement.lastElementChild.remove();
				}

				return itemBlock;
			}

		}

	}



	private createListContainer(): void {
		if (this.containerWaitElement != null) {
			this.containerWaitElement.remove();
			this.containerWaitElement = null;
		}
		if (this.containerEmptyElement != null) {
			this.containerEmptyElement.remove();
			this.containerEmptyElement = null;
		}
		if (this.containerElement != null) {
			return;
		}

		this.containerElement = document.createElement("div");
		this.containerElement.className = "list-container";
		this.element.appendChild(this.containerElement);
	}




	private createWaitContainer(): void {
		if (this.containerElement != null) {
			this.containerElement.remove();
			this.containerElement = null;
		}
		if (this.containerEmptyElement != null) {
			this.containerEmptyElement.remove();
			this.containerEmptyElement = null;
		}
		if (this.isListComplete || this.containerWaitElement != null) { //Return if list complete or wait already exist
			return;
		}

		this.containerWaitElement = document.createElement("div");
		this.containerWaitElement.className = "wait-container";
		this.element.appendChild(this.containerWaitElement);

		const waitElement: HTMLDivElement = document.createElement("div");
		waitElement.className = "wait";
		this.containerWaitElement.appendChild(waitElement);

		const waitImageElement = document.createElement("div");
		waitImageElement.className = "img";
		//this.waitImage.alt = "Wait";

		var imageHtml: string = UI.getSVGLoader();
		waitImageElement.innerHTML = imageHtml;
		waitElement.appendChild(waitImageElement);

		const waitTextElement: HTMLParagraphElement = document.createElement("p");
		waitElement.appendChild(waitTextElement);
	}




	private creatEmptyContainer(): void {
		if (this.containerElement != null) {
			this.containerElement.remove();
			this.containerElement = null;
		}
		if (this.containerWaitElement != null) {
			this.containerWaitElement.remove();
			this.containerWaitElement = null;
		}
		if (this.containerEmptyElement != null) {
			return;
		}

		this.containerEmptyElement = document.createElement("div");
		this.containerEmptyElement.className = "empty-container";
		this.element.appendChild(this.containerEmptyElement);

		const waitElement: HTMLParagraphElement = document.createElement("p");
		waitElement.innerText = Language.language.List_Empty;
		this.containerEmptyElement.appendChild(waitElement);
	}






}
