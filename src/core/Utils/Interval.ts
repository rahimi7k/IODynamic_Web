
export class Interval {

	//private interval: NodeJS.Timeout;
	private executedCount: number;
	private count: number;
	private interval: number;
	private caller: string;

	/**
	 * 
	 * @param func Function will execute
	 * @param interval Interval time in mili second
	 * @param count Total count that interval should continue
	 */
	constructor(func: () => boolean, interval: number = 90, count: number = 45, startAt: number = 0, caller: string = null) {
		this.executedCount = 0;
		this.count = count;
		this.interval = interval;
		this.caller = caller;

		this.execute(func, startAt);
	}


	private execute(func: () => boolean, interval: number): void {
		if (this.executedCount < this.count) {

			setTimeout(() => {
				if (func()) {
					return;
				}
				this.executedCount++;
				console.log("Interval - executedCount: " + this.executedCount + (this.caller == null ? "" : " - Caller: " + this.caller));
				this.execute(func, this.interval);
			}, interval);
		}
	}

}