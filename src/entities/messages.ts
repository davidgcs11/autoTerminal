export enum AutoTerminalMessage {
    noWorkbenchFolder = 'Please open a folder on your workspace to start using this extension 😓',
    missingOrInvalidSettings = 'Seems your autoTerminal.json file is invalid or missing 😓. Want to create a new one?',
    mockSettingsCreated = 'Mock settings created sucessfully 😎',
    noActiveTerminal = 'Could not find an active terminal opened 😓',
    noTerminalsOnSelectedCommand = 'We could not find any terminal in the selected command 😓',
}

export enum AutoTerminalButtons {
    addWorkbenchFolder = 'Add a folder to workbench',
    createMockConfig = 'Create mock config file',
    openTerminals = 'Try opening terminals again',
    openSettingsJSON = 'Open autoTerminal.json',
}
