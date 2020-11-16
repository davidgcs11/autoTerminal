
export type AutoTerminalSettings = AutoTerminalCommand[];

export type AutoTerminalCommand = {
    /** @description Command name, needed to initialize the list of terminals */
    name: string;
    /** @description Command description */
    description?: string;
    /** @description If needs to run on VSCode startup */
    runOnStartUp?: boolean;
    /** @description List of Window Terminals when executed */
    windowTerminals: AutoTerminalWindowTerminal[];
}

export type AutoTerminalWindowTerminal = AutoTerminalTerminalConfig[];

export type AutoTerminalTerminalConfig = {
    /** 
     * @description List of commands to execute. All are executed automatically by default with the last as exception
     * @example ["cd ./server", "npm start"]
     */
    commands: string[];
    /** @description Checks if the last give command should be run or only typed on the terminal */
    runLast?: boolean;
    /** @description Terminal name */
    name?: string
}
