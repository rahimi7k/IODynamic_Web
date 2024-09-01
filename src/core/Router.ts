import { ListnerDelegate } from "./ListnerDelegate";
import { JSONObject } from "./Utils/Json";
//import { Subscriber } from "./Subscriber";

export abstract class Router {

	/**
	 * Change the path of address bar
	 * @param path New path address, Path should start with / for remove old path completely
	 * @param addNewState Does history store old state or not, Default is false
	 */
	public static navigate(path: string, addNewState: boolean = false): void {

		let json: JSONObject = new JSONObject();
		json.put("oldPath", window.location.pathname); //href = Hypertext REFerence
		json.put("newPath", path);

		if (addNewState) {
			history.pushState({}, '', path);
		} else {
			history.replaceState({} , '', path);
		}


		ListnerDelegate.publish(ListnerDelegate.LISTNER_ROUTE, json);
	}


	public static clearQueryString(): void {
		window.history.pushState({}, document.title, location.href.split("?")[0]);
	}


	/*window.addEventListener('popstate', (event) => {
		console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`);
	});*/


}