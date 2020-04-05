import * as vscode from 'vscode';
import * as css from "./inject-css.css";
import * as essential from "./check-version.version";

export function activate(context: vscode.ExtensionContext) {
	console.log("my activation is already started");

	let listItem = ["Add Image", "Update new background", "Loop Infinite Background", "Change Background Visibility", "Clear Image"];

	// thêm ảnh 
	const addDisposable = vscode.commands.registerCommand('extension.background-image.add', async (asked: vscode.Uri[] | undefined) => {
		if(asked === undefined) {
			return ;
		}

		await css.default(essential.default, asked, 0.8).addCss();
	});
	context.subscriptions.push(addDisposable);


	// update độ hiển thị
	const updateOpacityBackground = vscode.commands.registerCommand("extension.background-image.update.opacity", async (blur: number) => {
		await css.default(essential.default).updateInfo(null, blur);
	});
	context.subscriptions.push(updateOpacityBackground);


	// clear hình nền
	const clearDisposable = vscode.commands.registerCommand('extension.background-image.clear', async () => {
		await css.default(essential.default).clearCss();
	});
	context.subscriptions.push(clearDisposable);


	// update hình nền mới
	const updateBackgroundImage = vscode.commands.registerCommand("extension.background-image.update.background-image", async (new_image: vscode.Uri[]) => {
		await css.default(essential.default).updateInfo(new_image);
	});
	context.subscriptions.push(updateBackgroundImage);


	// chạy bảng lựa chọn chính
	const disposable = vscode.commands.registerCommand('extension.background-image', async () => {
		await vscode.window.showQuickPick(listItem).then(async (item) => {
			if(item === "Add Image") {
				let asked = await vscode.window.showOpenDialog({
					canSelectMany: false,
					filters: {
						Image: ["jpg", "png", "gif"]
					}
				});
			
				vscode.commands.executeCommand("extension.background-image.add", asked);
			}

			if(item === "Update new background") {
				let new_image = await vscode.window.showOpenDialog({
					canSelectMany: false,
					filters: {
						Image: ["jpg", "png", "gif"]
					}
				});

				vscode.commands.executeCommand("extension.background-image.update.background-image", new_image);
			}

			if(item === "Change Background Visibility") {
				let answer = await vscode.window.showInputBox({
					placeHolder: "Hãy gõ một số bất kì từ 0.1 đến 1 để hiển thị màu hình theo ý bạn",
					prompt: "Chọn đi chờ chi, hãy coi kimetsu no yaiba [LỒNG TIẾNG] nào"
				});

				vscode.commands.executeCommand("extension.background-image.update.opacity", answer);
			}

			if(item === "Clear Image") {
				vscode.commands.executeCommand("extension.background-image.clear");
			}
			
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate({ subscriptions }: vscode.ExtensionContext) {
	subscriptions.forEach(sub => {
		sub.dispose();
	});
}
