/*
 * @Author: moelody yfsmallmoon@gmail.com
 * @Date: 2022-12-30 14:42:55
 * @LastEditors: moelody yfsmallmoon@gmail.com
 * @LastEditTime: 2023-01-01 01:45:29
 * @FilePath: \obsidian-copy-url-in-preview\src\main.ts
 * @Description:
 *
 * Copyright (c) 2022 by moelody yfsmallmoon@gmail.com, All Rights Reserved.
 */
import {
	Menu,
	Plugin,
	Notice,
	MenuItem,
	Platform,
	TFile,
	FileSystemAdapter,
	arrayBufferToBase64,
} from "obsidian";
import {
	ElectronWindow,
	FileSystemAdapterWithInternalApi,
	onElement,
	AppWithDesktopInternalApi,
} from "./helpers";

export default class CopyUrlInPreview extends Plugin {
	configDir: string;
	vaultPath: string;
	vaultUriPrefix: string;
	currentFocusImg: Element;
	onload() {
		this.currentFocusImg = null;
		this.configDir = this.manifest.dir;
		this.vaultPath = (
			app.vault.getRoot().vault.adapter as FileSystemAdapter
		)
			.getBasePath()
			.replace(/\\/g, "/");
		this.vaultUriPrefix = `app://local/${this.vaultPath}`;
		this.register(
			onElement(
				document,
				"mouseover" as keyof HTMLElementEventMap,
				"img",
				this.onMouseOver.bind(this)
			)
		);
	}

	onMouseOver(event: MouseEvent) {
		event.preventDefault();
		const target = event.target as Element;
		if (target !== this.currentFocusImg) {
			const imgType = target.localName;
			switch (imgType) {
				case "img": {
					const image = (target as HTMLImageElement).currentSrc;
					const thisURL = new URL(image);
					const Proto = thisURL.protocol;
					switch (Proto) {
						case "app:":
							const imageSourcePath = decodeURI(image);
							const imagePath = imageSourcePath
								.replace("app://local/", "")
								.replace(/[?#].*/, "");
							navigator.clipboard.write([
								new ClipboardItem({
									"text/plain": new Blob([imagePath], {
										type: "text/plain",
									}),
								}),
							]);
							break;
						default:
							new Notice(`no handler for ${Proto} protocol`);
							return;
					}
					break;
				}
				default:
					new Notice("No handler for this image type!");
					return;
			}
		} else {
			this.currentFocusImg = target;
		}
	}
}
