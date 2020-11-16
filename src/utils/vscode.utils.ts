import * as vscode from 'vscode';
import { VSCodeActions } from '../entities';

export async function executeVSCommand(action: VSCodeActions, ...args: any[]) {
    await vscode.commands.executeCommand(action, ...args);
}
