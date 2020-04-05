import * as fs from "fs";
import * as vscode from "vscode";
import * as open from "open";
import * as path from "path";

import * as essential from "./check-version.version";
import { Essential } from "./type";

export default (function processCss(basicInfo: Essential, url?: vscode.Uri[] | any, opacity?: number) {
    const { cssRootFile, vscode_version } = basicInfo;
    const regex = new RegExp(`\\/\\* background-image-${vscode_version}-extension \\*\\/`, "gm");
    let convertUri = decodeURI(url[0].toString().replace("file:///", "")).replace("%3A", ":") || "";
    let overlay = opacity || 0.8;
    let isAdded = false;

    
    let cssContentNeedToAdd = (version: string, convertUri?: string, overlay?: number) => `
        /* background-image-${version}-extension */
        body {
            background-size: cover;
            background-repeat: no-repeat;
            background-image: url('${convertUri}');
            opacity: ${overlay};
        }
    `;

    const clearCss = () => {
        const oldContent = fs.readFileSync(cssRootFile, { encoding: "utf8" });
        const newContent = oldContent.replace(cssContentNeedToAdd(vscode_version, convertUri, overlay), '');

        fs.writeFile(cssRootFile, newContent, { encoding: "utf8" }, (err) => {
            vscode.window.showInformationMessage("You have uninstall this extension");
            isAdded = false;
        });

        return ;
    };

    const addCss = async () => {
        if(isAdded) {
            vscode.window.showWarningMessage("Bạn đã thêm hình vào rồi, xin vui lòng chọn Update background để thay đổi hình nhé");
            return;
        }

        await fs.appendFile(cssRootFile, cssContentNeedToAdd(vscode_version, convertUri, overlay), { encoding: "utf8" }, (err: any) => {
            vscode.window.showInformationMessage("You added image file!!");
            isAdded = true;
            return ;
        });
    };

    const updateInfo = (uri?: vscode.Uri[] | any, blur?: number) => {
        if(isAdded) {
            if(uri[0] !== "") {
                clearCss();
                convertUri = decodeURI(url[0].toString().replace("file:///", "")).replace("%3A", ":") || "";
                addCss();
                return ;
            }

            if(blur) {
                clearCss();
                overlay = blur;
                addCss();
                return ;
            }
        }

        vscode.window.showWarningMessage("Bạn chưa có đặt 1 hình nào đó làm background");
        return ;
    };

    return {
        clearCss,
        updateInfo,
        addCss
    };
});
