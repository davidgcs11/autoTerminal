import * as vscode from 'vscode';
import { createMockSettingsJSON, executeVSCommand, openSettingsJSON } from '.';
import { AutoTerminal, AutoTerminalButtons, AutoTerminalMessage, VSCodeActions } from '../entities';
import openTerminals from '../functions/openTerminal';

function canShowMessage(): boolean {
    return vscode.workspace.getConfiguration(AutoTerminal.settingsName).get(AutoTerminal.options.showHints) ?? true;
}

export async function showMessage(error: AutoTerminalMessage, ...button: AutoTerminalButtons[]) {
    if (!canShowMessage()) { return; }
    const userResponse = await vscode.window.showInformationMessage(error, ...button);
    await handleErrorButtonPressed(userResponse);
}

async function handleErrorButtonPressed(buttonPressed: string | undefined): Promise<void> {
    switch (buttonPressed) {
        case AutoTerminalButtons.addWorkbenchFolder:
            return executeVSCommand(VSCodeActions.addFolderToWorkspace);
        case AutoTerminalButtons.createMockConfig:
            return createMockSettingsJSON();
        case AutoTerminalButtons.openTerminals:
            return openTerminals();
        case AutoTerminalButtons.openSettingsJSON:
            return openSettingsJSON();
        default:
            return;
    }
}