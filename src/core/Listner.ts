import { ArrayList } from "./Utils/ArrayList";

export namespace Listner {


	export class Listner {

		private readonly list: ArrayList<Listner.IListner> = new ArrayList<Listner.IListner>();
		private readonly listRemoveAfter: ArrayList<Listner.IListner> = new ArrayList<Listner.IListner>();
		private readonly listAddAfter: ArrayList<Listner.IListner> = new ArrayList<Listner.IListner>();

		private broadcasting: number = 0;
		private readonly listnerId: number = 0;


		constructor(id: number) {
			this.listnerId = id;
		}



		public add(delegate: Listner.IListner): void {
			if (this.broadcasting != 0) {
				this.listAddAfter.push(delegate);
			} else {
				if (this.list.has(delegate)) {
					return;
				}
				this.list.push(delegate);
			}
		}



		public remove(delegate: Listner.IListner): void {
			if (this.broadcasting != 0) {
				this.listRemoveAfter.push(delegate);
			} else {
				this.list.remove(delegate);
			}
		}



		public count(): number {
			return this.list.length;
		}



		public publish(...args: Object[]): void {

			this.broadcasting++;
			if (!this.list.isEmpty()) {
				this.list.getList().forEach((listner: Listner.IListner) => {
					listner.onEvent(this.listnerId, ...args);
				});
			}
			this.broadcasting--;

			if (this.broadcasting == 0) {
				if (this.listRemoveAfter.length != 0) {

					this.listRemoveAfter.getList().forEach((listner: Listner.IListner) => {
						this.remove(listner);
					});
					this.listRemoveAfter.clear();
				}
				if (this.listAddAfter.length != 0) {
					this.listAddAfter.getList().forEach((listner: Listner.IListner) => {
						this.add(listner);
					});
					this.listAddAfter.clear();
				}
			}
		}

	}



	export interface IListner {
		onEvent(id: number, ...args: Object[]): void;
	}

	export class IStaticListner implements Listner.IListner {
		onEvent(id: number, ...args: Object[]): void {

		}
	}

}
