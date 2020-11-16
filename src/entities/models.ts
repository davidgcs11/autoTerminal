import * as vscode from 'vscode';

export type TerminalCommands = {
    commands: string[];
    runLast: boolean;
    terminal: vscode.Terminal
};


