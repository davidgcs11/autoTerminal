import * as vscode from 'vscode';
import { takeABreak } from '.';
import { AutoTerminal,AutoTerminalTerminalConfig,VSCodeActions } from '../entities';
import { executeVSCommand } from './vscode.utils';

function shouldCloseTerminals(): boolean {
    return vscode.workspace.getConfiguration(AutoTerminal.settingsName).get(AutoTerminal.options.closeOpenTerminals) ?? true;
}

export async function runCommandsInTerminal(commands: string[], terminal: vscode.Terminal, runLast: boolean) {
    for (let j = 0; j < commands.length; j++) {
        const command = commands[j];
        const isLast = j === commands.length - 1;
        const autoRun = !isLast || runLast;
        terminal.sendText(command, autoRun);
    }
}

export async function createNewSubTerminal(config: AutoTerminalTerminalConfig): Promise<vscode.Terminal> {
    return new Promise(async (resolve) => {
        await executeVSCommand(VSCodeActions.splitTerminals);
        if (config.name) {
            await executeVSCommand(VSCodeActions.renameTerminal, { name: config.name });
        }

        vscode.window.onDidChangeActiveTerminal((terminal) => {
            if (terminal) { resolve(terminal); }
        });

    });
}

export async function handleOpenedTerminals() {
    await takeABreak();
    if (vscode.window.activeTerminal && shouldCloseTerminals()) {
        vscode.window.terminals.forEach((terminal: vscode.Terminal) => {
            terminal.dispose();
        });
    }
    await takeABreak();
}

// export function mapTerminalToTerminalConfig(terminal: vscode.Terminal): TerminalConfig {
//     const name = terminal.name;
//     const autoRun = terminal.processId
//     vscode.window.terminals[0].
//     return {
//         commands: string[];
//         autoRun: boolean;
//         name?: string;
//     };
// }