
export class ArrayList<T> implements Iterable<T> {

	*[Symbol.iterator](): Iterator<T, any, undefined> {
		for (let key of this.list) {
			yield key;
		}
	}

	private list: T[] = [];

	/**
	 * Add at the end
	 * @param key
	 */
	public push(key: T): void {
		this.list.push(key);
	}

	/**
	 * Add in the specific position
	 * @param index Index of the key
	 * @param key
	 */
	public update(index: number, key: T): void {
		this.list[index] = key;
	}

	/**
	 * Get the key with index
	 * @param index Index of the key
	 */
	public get(index: number): T {
		return this.list[index];
	}

	/**
		 * Remove from the end
		 * @param key
		 */
	public pop(): void {
		this.list.pop();
	}

	/**
	 * Remove from the first
	 * @param key
	 */
	public shift(): void {
		this.list.shift();
	}

	/**
	 * Add at the first
	 * @param key
	 */
	public unshift(key: T): void {
		this.list.unshift(key);
	}

	/**
	 * Add in the specific position
	 * @param key
	 */
	public addInPosition(index: number, key: T): void {
		this.list.splice(index, 0, key);
	}

	/**
	 * Get the index of a key
	 * @param key
	 */
	public getIndex(key: T): number {
		return this.list.indexOf(<any>key);
	}

	/**
	 * Remove at the specific position
	 * @param index Index of the key
	 */
	public removeAtPosition(index: number): void {
		this.list.splice(index, 1);
	}

	/**
	 * Find a key from the list
	 * @param key
	 */
	public remove(key: T): void {
		this.removeAtPosition(this.getIndex(key));
	}


	/**
	 * Get the length of the list
	 */
	public get length(): number {
		return this.list.length;
	}

	/**
	 * Clear the list
	 */
	public clear(): void {
		this.list.splice(0, this.list.length);
	}

	/**
	 * Check that list includes a key or not
	 * @param key
	 */
	public has(key: T): boolean {
		return this.list.indexOf(<any>key) !== -1;
	}


	public addArrayList(arrayList: ArrayList<T>): void {
		for (var i = 0; i < arrayList.length; i++) {
			this.push(arrayList.get(i));
		}
	}

	public addArray(array: Array<T>): void {
		for (var key of array) {
			this.push(key);
		}
	}

	public addJavascriptArray(arrayList: any[]): void {
		for (var i = 0; i < arrayList.length; i++) {
			this.push(arrayList[i]);
		}
	}


	public getList(): T[] {
		return this.list;
	}

	/**
	 * Check that list is empty
	 */
	public isEmpty(): boolean {
		return this.list.length === 0;
	}


}
