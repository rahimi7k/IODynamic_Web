import { ArrayList } from "./Utils/ArrayList";

export class Subscriber {

	private subscriber: ArrayList<(data: any) => void> = new ArrayList<(data: any) => void>();

	/**
	 * Subscribe for an event 
	 *	 
	 * @param callback Callback function 
	 */
	public subscribe(callback: (data: any) => void): void {
		this.subscriber.push(callback);
	}

	/**
	 * Unsubscribe of an event 
	 *	 
	 * @param callback Callback function 
	 */
	public unsubscribe(callback: (data: any) => void): void {
		this.subscriber.remove(callback);
	}

	/**
	* The number of listner of an event 
	*/
	public count(): number {
		return this.subscriber.length;
	}

	/**
	 * Publish an event with optional data to subscriber(s) 
	 * 
	 * @param data The data which may be needed in an event
	 */
	public publish(): void;
	public publish(data: any): void;
	public publish(data?: any): void {
		this.subscriber.getList().forEach((callback) => {
			callback(data);
		})
	}

}