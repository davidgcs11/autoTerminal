import * as vscode from 'vscode';

import { AutoTerminalButtons, AutoTerminalMessage } from '../entities';
import { checkFolderWorkspace, showMessage } from '../utils';


export default async function saveTerminals() {

    /// Ensure workbench has an open folder 🧐
    const openFolder = checkFolderWorkspace();
    if (!openFolder) {
        await showMessage(AutoTerminalMessage.noWorkbenchFolder, AutoTerminalButtons.addWorkbenchFolder);
        return;
    }

    /// Ensure a terminal is opened
    const openVsCodeTerminal = vscode.window.activeTerminal;
    if (!openVsCodeTerminal) {
        await showMessage(AutoTerminalMessage.noActiveTerminal);
        return;
    }
    /// API not available at the moment will work into this later
    return;

}

