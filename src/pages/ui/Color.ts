import { EnumUtils } from '../../core/Utils/EnumUtils';


export class Color {

	public static getRandomColor(): string {
		return EnumUtils.getRandomFromStringEnum(Color.Color);
	}

	public static getRandomAttractiveColor(): string {
		return EnumUtils.getRandomFromStringEnum(Color.AttractiveColor);
	}


	public static rgbToHex(red: number, green: number, blue: number): string {
		//const rgb = (red << 16) | (green << 8) | (blue << 0);
		//return '#' + (0x1000000 + rgb).toString(16).slice(1);
		return "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
	}

	public static hexToRgb(hex: string): any {
		/*const normal = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
		if (normal) {
			return normal.slice(1).map(e => parseInt(e, 16));
		};

		const shorthand = hex.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
		if (shorthand) {
			return shorthand.slice(1).map(e => 0x11 * parseInt(e, 16))
		};*/


		// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
		hex = hex.replace(shorthandRegex, function (m, r, g, b) {
			return r + r + g + g + b + b;
		});

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return {
			red: parseInt(result[1], 16),
			green: parseInt(result[2], 16),
			blue: parseInt(result[3], 16)
		};
	}


	public static changeColor(colorHash: string, count: number): string {
		var rgbColor: any = Color.hexToRgb(colorHash);
		if (count > 0) {
			var red: number = (rgbColor.red as number) + count < 255 ? (rgbColor.red as number + count) : 255;
			var green: number = (rgbColor.green as number) + count < 255 ? (rgbColor.green as number + count) : 255;
			var blue: number = (rgbColor.blue as number) + count < 255 ? (rgbColor.blue as number + count) : 255;
		} else {
			var red: number = (rgbColor.red as number) + count >  0 ? (rgbColor.red as number + count) : 0;
			var green: number = (rgbColor.green as number) + count > 0 ? (rgbColor.green as number + count) : 0;
			var blue: number = (rgbColor.blue as number) + count > 0 ? (rgbColor.blue as number + count) : 0;
		}

		return Color.rgbToHex(red, green, blue)
	}




}

export namespace Color {
	export enum Color {
		White = "#ffffff",
		Black = "#000000",
		Red = "#e0334f",
		Green = "#41ce45",
		Blue = "#4293df",
		BlueSky = "#21bef4",
		Yellow = "#e5ec1e",
		Orange = "#f1920a",
		Gray = "#bfbfbf",
		Green_Successeful = "#25dc2a",
		Purple = "#945eff",
	}


	export enum AttractiveColor {
		Red = "#e0334f",
		Green = "#41ce45",
		Blue = "#4293df",
		BlueSky = "#21bef4",
		Yellow = "#e5ec1e",
		Orange = "#f1920a",
		Gray = "#bfbfbf",
		Green_Successeful = "#25dc2a",
		purple = "#945eff",
	}

}