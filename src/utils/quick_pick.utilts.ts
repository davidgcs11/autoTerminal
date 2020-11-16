import * as vscode from 'vscode';
import { AutoTerminalCommand } from '../entities';

export function buildQuickPickCommand(command: AutoTerminalCommand): vscode.QuickPickItem {
    return { label: command.name, description: command.description };
}