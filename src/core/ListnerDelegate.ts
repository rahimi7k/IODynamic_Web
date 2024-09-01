import { Listner } from "./Listner";

export class ListnerDelegate {


	private static readonly listners: Map<number, Listner.Listner> = new Map<number, Listner.Listner>();
	private static eventNumber: number = 1;
	public static readonly LISTNER_ROUTE: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_LANGUAGE: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_SETTING: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_CLI: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_USER: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_CONNECTION_STATE: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_COIN: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_ORDER_INFO: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_ORDER_HISTORY: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_OFFER: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_STORE_PACKAGE: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_UNFOLLOW: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_UNCOIN: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_INTRO_MESSAGE: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_NEW_MESSAGE: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_MESSAGE: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_DELETE_MESSAGE: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_ENCRYTION = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_RATE_CONFIG: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_ADD_CONFIG: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_ORDER_CONFIG: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_ORDER_INFO_CONFIG: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_PROXY_STATE: number = ListnerDelegate.eventNumber++;
	public static readonly LISTNER_IUSER: number = ListnerDelegate.eventNumber++;


	/**
	 * Listen for an event 
	 *	 
	 * @param listnerId The id of the listner 
	 * @param listner Listner class
	 */
	public static add(listnerClass: Listner.IListner, listnerId: number): void {
		let listner: Listner.Listner = ListnerDelegate.listners.get(listnerId);
		if (listner == null) {
			listner = new Listner.Listner(listnerId);
			ListnerDelegate.listners.set(listnerId, listner);
		}
		listner.add(listnerClass);
	}


	/**
	 * Remove for listen to an event 
	 *	 
	 * @param listnerId The id of the listner 
	 * @param listner Listner class
	 */
	public static remove(listnerClass: Listner.IListner, listnerId: number): void {
		let listner: Listner.Listner = ListnerDelegate.listners.get(listnerId);
		if (listner == null) {
			return;
		}
		listner.remove(listnerClass);
	}


	/**
	* The number of listner of an event 
	*
	* @param listnerId The id of the listner 
	*/
	public static count(listnerId: number): number {
		let listner: Listner.Listner = ListnerDelegate.listners.get(listnerId);
		if (listner == null) {
			return 0;
		} else {
			return listner.count();
		}
	}



	/**
	 * Publish an event with optional data to listner(s) 
	 * 
	 * @param listnerId The id of the listner 
	 * @param ...args The argumans which may be needed in an event
	 * 
	 */
	public static publish(listnerId: number, ...args: Object[]): void {
		let listner: Listner.Listner = ListnerDelegate.listners.get(listnerId);
		if (listner != null) {
			listner.publish(...args);
		}
	}




}
