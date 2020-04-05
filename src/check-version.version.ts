import * as vscode from "vscode";
import * as path from "path";
import { Essential } from "./type";

/** note: vscode đc code từ electron framework
 *  @var vscode_version là biến chỉ lên phiên bản của vscode hiện tại bạn dùng
 *  @var cssFile là cái file mà nó đc dùng để include vào template của vscode
 */

const vscode_version = vscode.version;
const cssFile = vscode_version >= "1.38.0" ? "workbench.desktop.main.css" : "workbench.main.css";

/**
 * @var essential là 1 cái object để export ra
 */

const essential: Essential = {
    vscode_version,
    cssRootFile: path.join(path.dirname((require.main as NodeModule).filename), "vs", "workbench", cssFile),
};


export default Object.freeze(essential);

