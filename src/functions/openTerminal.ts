import * as vscode from 'vscode';

import { AutoTerminalButtons, AutoTerminalCommand, AutoTerminalMessage, AutoTerminalTerminalConfig, TerminalCommands, } from '../entities';
import { buildQuickPickCommand, checkFolderWorkspace, createNewSubTerminal, handleOpenedTerminals, loadTerminalsFromSettings, runCommandsInTerminal, showMessage, takeABreak } from '../utils';


export default async function openTerminals(startUpRun: boolean = false) {

  /// Ensure workbench has an open folder 🧐
  const openFolder = checkFolderWorkspace();
  if (!openFolder) {
    await showMessage(AutoTerminalMessage.noWorkbenchFolder, AutoTerminalButtons.addWorkbenchFolder);
    return;
  }

  /// Load terminal config from JSON 🧐
  const loadedSettings = await loadTerminalsFromSettings();
  if (!loadedSettings.settings || !loadedSettings.isValid) {
    await showMessage(AutoTerminalMessage.missingOrInvalidSettings, AutoTerminalButtons.createMockConfig);
    return;
  }

  /// Ask user which command to run
  const settingsCommands = loadedSettings.settings;
  let selectedCommand: AutoTerminalCommand | undefined;

  if (startUpRun) {
    const pickedCommand = settingsCommands.find((command) => command.runOnStartUp);
    if (pickedCommand) {
      selectedCommand = pickedCommand;
    } else {
      return;
    }
  } else if (settingsCommands.length > 1) {
    const commandList = settingsCommands.map((command) => buildQuickPickCommand(command));
    const placeHolder = 'Select the command you want to run';
    const commandToRun = await vscode.window.showQuickPick(commandList, { placeHolder });
    const pickedCommand = settingsCommands.find((command) => command.name === commandToRun?.label);

    if (commandToRun && pickedCommand) {
      selectedCommand = pickedCommand;
    } else {
      return;
    }
  } else {
    selectedCommand = settingsCommands[0];
  }

  const windowTerminals = selectedCommand?.windowTerminals;

  if (!windowTerminals?.length) {
    await showMessage(AutoTerminalMessage.noTerminalsOnSelectedCommand, AutoTerminalButtons.openSettingsJSON);
    return;
  }

  /// Handle already opened terminals according to user settings 🧐
  await handleOpenedTerminals();

  let terminalCommandsToExecute: TerminalCommands[] = [];

  /// Open all needed terminals 😜
  for (const terminalWindow of windowTerminals) {
    if (!terminalWindow || !terminalWindow?.length) {
      /// If no terminal inside terminalWindows stop excecution 😭
      return;
    }


    /// Create the first terminal as the [baseWindowTerminal] 😎
    const firstTerminalConfig = terminalWindow[0];

    const baseWindowTerminal = vscode.window.createTerminal({ name: firstTerminalConfig?.name });
    baseWindowTerminal.show();

    await takeABreak();

    /// Save commands to setup into [baseWindowTerminal]
    const baseWindowCommands = buildTerminalCommand(baseWindowTerminal, firstTerminalConfig);
    terminalCommandsToExecute.push(baseWindowCommands);


    /// Create all given subTerminals using [baseWindowTerminal] as parent
    for (let i = 1; i < terminalWindow.length; i++) {
      const subTerminalConfig = terminalWindow[i];
      const newSubTerminal = await createNewSubTerminal(subTerminalConfig);
      await takeABreak();
      /// Save commands to setup into [newSubTerminal]
      const newSubTerminalCommands = buildTerminalCommand(newSubTerminal, subTerminalConfig);
      terminalCommandsToExecute.push(newSubTerminalCommands);
    }
  }

  /// Start running commands on all terminals
  terminalCommandsToExecute.forEach(async (termCmd: TerminalCommands) => {
    await runCommandsInTerminal(termCmd.commands, termCmd.terminal, termCmd.runLast);
  });
}


function buildTerminalCommand(terminal: vscode.Terminal, config: AutoTerminalTerminalConfig): TerminalCommands {
  return { terminal, commands: config.commands, runLast: config?.runLast ?? true };
}

