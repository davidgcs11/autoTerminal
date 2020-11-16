import * as path from 'path';
import * as vscode from 'vscode';
import { AutoTerminal } from '../entities/constants';


export function checkFolderWorkspace(): boolean {
    const folderOpened = getRootPath();
    return !!folderOpened;
}

export function getRootPath() {
    const directoryFiles = vscode.workspace.workspaceFolders;
    if (directoryFiles && directoryFiles.length > 0) {
        return directoryFiles[0].uri;
    } else {
        return undefined;
    }
}

export function getSettingJsonPath(): string | undefined {
    const rootPath = getRootPath();
    if (rootPath) {
        const settingsPath = path.resolve(rootPath.fsPath, AutoTerminal.vscodeFolder, AutoTerminal.settingsFileName);
        return settingsPath;
    } else {
        return undefined;
    }
}