import { AutoTerminal } from '../entities';

/** @description Breaks are necessary. Let VSCode rest 😂. Nah it gets buggy somehow if no break is taking before opening that many terminals */
export async function takeABreak(milliseconds: number = AutoTerminal.waitMillis) {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
}