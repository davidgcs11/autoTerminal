import * as vscode from 'vscode';
import * as fs from 'fs';
import * as defaultSettings from './defaultSettings.json';

import { getSettingJsonPath } from '.';
import { AutoTerminalSettings, AutoTerminalMessage, AutoTerminalButtons, VSCodeActions } from '../entities';
import { showMessage } from './message.utils';
import { executeVSCommand } from './vscode.utils';

const errorJsonText = '{}';
const mockSettings = undefined as unknown as AutoTerminalSettings;


export async function loadTerminalsFromSettings(): Promise<{ settings: AutoTerminalSettings, isValid: boolean }> {
    const settingsFilePath = getSettingJsonPath();
    if (settingsFilePath) {
        let fileContentText: string;
        try {
            const fileContent = await vscode.workspace.openTextDocument(settingsFilePath);
            fileContentText = fileContent.getText();
        } catch (error) {
            fileContentText = errorJsonText;
        }
        return validateSettings(fileContentText);
    } else {
        return { settings: mockSettings, isValid: false };
    }
}

export function validateSettings(contentText: string): { settings: AutoTerminalSettings, isValid: boolean } {
    if (contentText === errorJsonText) { return { settings: mockSettings, isValid: false }; }
    try {
        let isValid = true;
        const valid = (check: boolean) => isValid = isValid && check;

        const jsObj = JSON.parse(contentText) as AutoTerminalSettings;

        valid(Array.isArray(jsObj ?? null));
        if (isValid) {
            for (const command of jsObj) {
                valid(!!command.name);
                valid(Array.isArray(command?.windowTerminals ?? null));
                if (isValid) {
                    for (const windowTerminal of command.windowTerminals) {
                        valid(Array.isArray(windowTerminal));
                    }
                }
            }
        }
        const settings = jsObj as AutoTerminalSettings;
        return { settings, isValid };
    } catch (error) {
        return { settings: mockSettings, isValid: false };
    }
}


export async function createMockSettingsJSON() {
    const settingsPath = getSettingJsonPath();
    if (settingsPath) {
        const fileContent = JSON.stringify(defaultSettings);
        fs.writeFileSync(settingsPath, fileContent);
    }
    await showMessage(AutoTerminalMessage.mockSettingsCreated, AutoTerminalButtons.openTerminals, AutoTerminalButtons.openSettingsJSON);
}

export async function openSettingsJSON() {
    const settingsPath = getSettingJsonPath();
    if (settingsPath) {
        const fileContent = await vscode.workspace.openTextDocument(vscode.Uri.file(settingsPath));
        await vscode.window.showTextDocument(fileContent);
        await executeVSCommand(VSCodeActions.formatFile);
    }
}

