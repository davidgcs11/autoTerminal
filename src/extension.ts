
import * as vscode from 'vscode';
import openTerminals from './functions/openTerminal';
import { AutoTerminal } from './entities/constants';
import { createMockSettingsJSON, openSettingsJSON } from './utils';

export function activate(context: vscode.ExtensionContext) {

	const autoRun: boolean | undefined = vscode.workspace.getConfiguration(AutoTerminal.settingsName).get(AutoTerminal.options.autoRun);

	let openTerminalsFn = vscode.commands.registerCommand(`${AutoTerminal.settingsName}.openTerminals`, async () => {
		openTerminals();
	});
	context.subscriptions.push(openTerminalsFn);

	let openExtensionSettingsFn = vscode.commands.registerCommand(`${AutoTerminal.settingsName}.openAutoTerminalSettings`, async () => {
		openSettingsJSON();
	});
	context.subscriptions.push(openExtensionSettingsFn);

	let createExtensionSettingsFn = vscode.commands.registerCommand(`${AutoTerminal.settingsName}.createAutoTerminalSettings`, async () => {
		createMockSettingsJSON();
	});
	context.subscriptions.push(createExtensionSettingsFn);

	/// FUTURE FUNCTION TO SAVE THE EXISTING OPEN TERMINALS TO CONFIG JSON
	// let saveTerminalsFn = vscode.commands.registerCommand(`${AutoTerminal.settingsName}.saveTerminals`, async () => {
	// 	saveTerminals();
	// });
	// context.subscriptions.push(saveTerminalsFn);

	if (autoRun) {
		openTerminals(true);
	}
}

export function deactivate() { }
