/*
 * @Author: moelody yfsmallmoon@gmail.com
 * @Date: 2022-12-30 14:42:55
 * @LastEditors: moelody yfsmallmoon@gmail.com
 * @LastEditTime: 2023-01-01 01:45:41
 * @FilePath: \obsidian-copy-url-in-preview\src\helpers.ts
 * @Description:
 *
 * Copyright (c) 2023 by moelody yfsmallmoon@gmail.com, All Rights Reserved.
 */
import { App, FileSystemAdapter } from "obsidian";

export interface ElectronWindow extends Window {
	WEBVIEW_SERVER_URL: string;
}

export interface FileSystemAdapterWithInternalApi extends FileSystemAdapter {
	open(path: string): Promise<void>;
}

export interface AppWithDesktopInternalApi extends App {
	openWithDefaultApp(path: string): Promise<void>;
}

export interface Listener {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(this: Document, ev: Event): any;
}

export function onElement(
	el: Document,
	event: keyof HTMLElementEventMap,
	selector: string,
	listener: Listener,
	options?: { capture?: boolean }
) {
	el.on(event, selector, listener, options);
	return () => el.off(event, selector, listener, options);
}

export function parserImagePath(image: string) {
	const imageSourcePath = decodeURI(image);
	const imagePath = imageSourcePath
		.replace("app://local/", "")
		.replace(/[?#].*/, "");
	return imagePath;
}
