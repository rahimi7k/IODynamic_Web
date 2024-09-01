import { Interval } from '../Utils/Interval';
import { IndexDBHandler } from './IndexDBHandler';


export class IndexDB {

	constructor() {
		/*
		interval(30).pipe(
			startWith(0),
			filter((): boolean => {
				return IndexDBHandler.isIndexDbReady;
			}),
			take(1),
		).subscribe(() => {
			var thisClass = this;
			var iDBOpenDBRequest: IDBOpenDBRequest = window.indexedDB.open(IndexDBHandler.DATABASE_NAME, IndexDBHandler.DATABASE_VERSION);
			iDBOpenDBRequest.onsuccess = function (event) {
				thisClass.database = this.result;
			};

			iDBOpenDBRequest.onerror = function (event) {
				throw new Error("Database: " + this.error);
			};
		});
		*/
	}



	private static async isDatabaseReady(): Promise<void> {
		return new Promise<void>((resolve) => {
			new Interval(() => {
				if (IndexDBHandler.getDatabase() != null) {
					resolve();
					return true;
				}
				return false;
			}, 100, 50, 0);
		});
	}


	public async get(table: string, key: string): Promise<any> {
		return new Promise<void>(async (resolve) => {

			await IndexDB.isDatabaseReady();

			// var thisClass = this;
			var transaction = IndexDBHandler.getDatabase().transaction(table, "readonly");
			var objectStore = transaction.objectStore(table);
			var request = objectStore.get(key);
			request.onsuccess = function () {
				resolve(request.result);
			};

			request.onerror = function (event) {
				throw new Error("IndexDB: " + this.error);
			};

		});
	}


	public async set(table: string, key: string, value: any): Promise<void> {
		return new Promise<void>( async (resolve) => {

			await IndexDB.isDatabaseReady();

			// var thisClass = this;
			var transaction = IndexDBHandler.getDatabase().transaction(table, "readwrite");
			var objectStore = transaction.objectStore(table);
			var req = objectStore.openCursor(key);

			req.onsuccess = function () {
				var objectStoreRequest;
				if (this.result) {
					objectStoreRequest = this.result.update(value);
				} else {
					objectStoreRequest = objectStore.add(value, key);
				}
				objectStoreRequest.onsuccess = function (event) {
					resolve();
				};
				objectStoreRequest.onerror = function (event) {
					throw new Error("IndexDB: " + this.error);
				};
			};

			req.onerror = function (event) {
				throw new Error("IndexDB: " + this.error);
			};


		});

	}


	public async delete(table: string, key: string): Promise<void> {
		return new Promise<void>(async (resolve) => {

			await IndexDB.isDatabaseReady();

			// var thisClass = this;
			var transaction = IndexDBHandler.getDatabase().transaction(table, "readwrite");
			var objectStore = transaction.objectStore(table);
			var req = objectStore.openCursor(key);
			req.onsuccess = function () {
				if (this.result) {
					var objectStoreRequest = objectStore.delete(key);
					objectStoreRequest.onsuccess = function (event) {
						resolve();
					};

					objectStoreRequest.onerror = function (event) {
						throw new Error("IndexDB: " + this.error);
					};
				} else {
					resolve();
				}
			};

			req.onerror = function (event) {
				throw new Error("IndexDB: " + this.error);
			};

		});


	}


	public async flush(table: string): Promise<void> {
		return new Promise<void>(async (resolve) => {

			await IndexDB.isDatabaseReady();

			// var thisClass = this;
			var transaction = IndexDBHandler.getDatabase().transaction(table, "readwrite");
			var objectStore = transaction.objectStore(table);
			var objectStoreRequest = objectStore.clear();
			objectStoreRequest.onsuccess = function (event) {
				resolve();
			};

			objectStoreRequest.onerror = function (event) {
				throw new Error("IndexDB: " + this.error);
			};

		});
	}


	public static async dropTable(table: string): Promise<void> {
		return new Promise<void>(async (resolve) => {

			await IndexDB.isDatabaseReady();

			window.indexedDB.deleteDatabase(table);
			resolve();
		});
	}

	/*
	public close(): void {
		if (this.database != null) {
			this.database.close();
			this.database = null;
		}
	}
	*/
}
