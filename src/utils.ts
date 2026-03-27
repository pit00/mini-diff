import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export let config: vscode.WorkspaceConfiguration;
export let gutterConfig: any = {};
export let overviewConfig: any = {};
export let outputController: vscode.OutputChannel;

export const PKG_NAME = 'miniDiff';
export const PKG_ID = 'mini-diffs';
export const PKG_LABEL = 'Mini Diffs';

export type DecorRange = {
    name: string,
    addKey: vscode.TextEditorDecorationType,
    delKey: vscode.TextEditorDecorationType,
    changeKey: vscode.TextEditorDecorationType,
    ranges: {
        add: vscode.Range[],
        del: vscode.Range[],
        change: vscode.Range[],
    }
}

export type DocumentContent = {
    name: string,
    history: {
        content: string,
        lineCount: number,
    },
}

export function checkForOutputOption(context) {
    if (config.showDiffOutput) {
        if (!outputController) {
            outputController = vscode.window.createOutputChannel(PKG_LABEL, 'diff');
            
            context.subscriptions.push(outputController);
        }
    } else {
        if (outputController) {
            outputController.dispose();
        }
    }
}

export function getImgPath(type: string) {
    return vscode.extensions.getExtension(`pit00.${PKG_ID}`)!.extensionUri.path.replace(/\/(\w:)/, "$1") + `/img/${type}.svg`;
}

export function getFileNameFromPath(filePath) {
    return path.parse(filePath).name;
}

/* Config ------------------------------------------------------------------- */
export async function readConfig(): Promise<void> {
    config = vscode.workspace.getConfiguration(PKG_NAME);
    overviewConfig = config.styles.overview;
    gutterConfig = config.styles.gutter;
    
    await changeIconColorAdd('add', gutterConfig.add);
    await changeIconColorDel('del', gutterConfig.del);
    await changeIconColorChange('change', gutterConfig.change);
}

export function changeIconColorAdd(type: string, color: any) {
    return new Promise((resolve) => fs.writeFile(
        getImgPath(type),
        `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g fill="${color}" fill-rule="evenodd" clip-rule="evenodd" transform="matrix(1, 0, 0, 1, 0.5, 0.5)"><path d="M1.5 1h12l.5.5v12l-.5.5h-12l-.5-.5v-12l.5-.5zM2 13h11V2H2v11z" /><path d="M8 4H7v3H4v1h3v3h1V8h3V7H8V4z" /></g></svg>`,
        () => {
            resolve(true);
        },
    ));
}

export function changeIconColorChange(type: string, color: any) {
    return new Promise((resolve) => fs.writeFile(
        getImgPath(type),
        `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g fill="${color}" fill-rule="evenodd" clip-rule="evenodd" transform="matrix(1, 0, 0, 1, 0.5, 0.5)"><path d="M1.5 1h12l.5.5v12l-.5.5h-12l-.5-.5v-12l.5-.5zM2 13h11V2H2v11z" /><path d="M 7.5 10.5 C 9.809 10.5 11.253 8 10.098 6 C 9.562 5.072 8.572 4.5 7.5 4.5 C 5.191 4.5 3.747 7 4.902 9 C 5.438 9.928 6.428 10.5 7.5 10.5 Z" /></g></svg>`,
        () => {
            resolve(true);
        },
    ));
}

export function changeIconColorDel(type: string, color: any) {
    return new Promise((resolve) => fs.writeFile(
        getImgPath(type),
        `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><g fill="${color}" fill-rule="evenodd" clip-rule="evenodd" transform="matrix(1, 0, 0, 1, 0.5, 0.5)"><path d="M1.5 1h12l.5.5v12l-.5.5h-12l-.5-.5v-12l.5-.5zM2 13h11V2H2v11z" /><path d="M10 7v1H5V7h5z" /></g></svg>`,
        () => {
            resolve(true);
        },
    ));
}

export function groupConsecutiveLines(list) {
    return list.reduce((accumulator, currentValue) => {
        const lastGroup = accumulator[accumulator.length - 1];
        
        if (!lastGroup || lastGroup[lastGroup.length - 1].lineNumber !== currentValue.lineNumber - 1) {
            accumulator.push([]);
        }
        
        accumulator[accumulator.length - 1].push(currentValue);
        
        return accumulator;
    }, []);
}

export function showMessage(msg) {
    return vscode.window.showWarningMessage(`${PKG_LABEL}: ${msg}`);
}

export function isFileInGitRepo(filePath: string): boolean {
    for (let dir = path.dirname(filePath);;) {
        if (fs.existsSync(path.join(dir, '.git'))) return true;
        const parent = path.dirname(dir);
        if (parent === dir) return false;
        dir = parent;
    }
}
