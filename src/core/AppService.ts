import packageJson from '../../package.json';
import { IndexDB } from './IndexDB/IndexDB';
import { JSONObject } from './Utils/Json';
import { Storage } from './Utils/Storage';


export class AppService {

	public static isProd: boolean = true;
	private static startTime: number;



	public static startTimer() {
		AppService.startTime = performance.now();
	}

	public static endTimer() {
		console.log(`Took ${performance.now() - AppService.startTime}ms`);
	}


	public static initialize(): void {
		if (process.env.MODE === "Production") {
			AppService.isProd = true;
		} else {
			AppService.isProd = false;
		}

	}



	public static get version(): string {
		return packageJson.version;
	}


	public static setTitle(title: string): void {
		document.title = title;
	}






	public static getOperatingSystem(): string {

		if (AppService.isDevicePhone()) {
			var userAgent = navigator.userAgent || navigator.vendor || window.opera;
			// Windows Phone must come first because its UA also contains "Android"
			if (/windows phone/i.test(userAgent)) {
				return "windows";
			}
			if (/android/i.test(userAgent)) {
				return "android";
			}
			// iOS detection from: http://stackoverflow.com/a/9039885/177710
			if (/iPad|iPhone|iPod/.test(userAgent)) {
				return "ios";
			}

		} else {
			console.log("navigator.appVersion", navigator.appVersion);
			if (navigator.appVersion.indexOf("Win") !== -1) {
				return "windows";
			}
			if (navigator.appVersion.indexOf("Mac") !== -1) {
				return "macOS";
			}
			if (navigator.appVersion.indexOf("X11") !== -1) {
				return "unix";
			}
			if (navigator.appVersion.indexOf("Linux") !== -1) {
				return "linux";
			}
		}

		return "";
	}

	public static isDevicePhone() {
		const toMatch = [
			/Android/i,
			/webOS/i,
			/iPhone/i,
			/iPad/i,
			/iPod/i,
			/BlackBerry/i,
			/Windows Phone/i
		];

		return toMatch.some((toMatchItem) => {
			return navigator.userAgent.match(toMatchItem);
		});
	}





	/*
	public static getIp(): Promise<string> {
	  return new Promise<any>((resolve): void => {
		let xhttp = new XMLHttpRequest();
		xhttp.open("GET", "https://www.cloudflare.com/cdn-cgi/trace", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.timeout = 5000;
  
		xhttp.send();
		xhttp.onreadystatechange = () => {
		  if (xhttp.readyState === 4 && xhttp.status === 200) {
			let response = xhttp.responseText;
			const re = new RegExp('ip=(.*?)\\n');
			var reqExpArray = re.exec(response);
			if (reqExpArray.length > 1) {
			  resolve(reqExpArray[1]);
			  return;
			}
		  }
		};
		resolve (null);
	  });
	}

	public static async downloadSQL(): Promise<void> {
		var indexDB: IndexDB = new IndexDB();
		var a = await indexDB.get("FILE_DATA", "/db/app.sqlite");
		AppService.download(a, "sql", "db")
	}

	public static download(data: Uint8Array, filename: string, type: string): void {
		var file = new Blob([data]);

		var a = document.createElement("a");
		var url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename + "." + type;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}


	public static loadScript(url: string) {
		const body = <HTMLDivElement>document.body;
		const script = document.createElement('script');
		script.innerHTML = '';
		script.src = url;
		script.async = false;
		script.defer = true;
		body.appendChild(script);
	}
	*/
}
