import { SettingController } from '../../pages/pages/setting/setting.controller';

export class Media {

	private isStopOldAudio: boolean = false;


	public static playAudio(audioFileName: string): void {

		if (!SettingController.getAudioStatus()) {
			return;
		}
		/*
		if (Media.audio != null) {
			// Media.audio.pause();
			Media.audio.currentTime = 0;
		}
		*/


		var audio: HTMLAudioElement = new Audio("/assets/audio/" + audioFileName);
		audio.volume = SettingController.getVolume() / 100;

		var promise: Promise<void> = audio.play();
		if (promise !== undefined) {
			promise.then(() => {
				audio.play();
			}).catch(error => {
				// Auto-play was prevented
				// Show paused UI.
			});
		}
	}

}
