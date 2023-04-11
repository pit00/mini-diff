import fs from 'fs';
import path fr

    name: string,
    addKey: vscode.TextEditorDecorationType,
    delKey: vscode.TextEditorDecorationType,
    changeKey: vscode.TextEditorDecorationType,
    ranges: {
        del: vscode.Range[],
        change: vscode.Range[],
    },
    commentThreads: vscode.CommentThread[],
}

export type DocumentContent = {
    name: string,
    history: {
        content: string,
        lineCount: number,
    },
}

export async function checkForGitPresence(context) {
    let check = false;

    if (config.scmDisable) {
        const files = await vscode.workspace.findFiles('.gitignore', null, 1);

        check = !!files.length;
    }

    if (check) {
        if (commentController) {
            commentController.dispose();
        }
    } else {
        commentController = vscode.comments.createCommentController(PKG_ID, PKG_LABEL);

        context.subscriptions.push(commentController);
    }
}

export async function checkForGitRepo(context) {
    let check = false;
    config = vscode.workspace.getConfiguration(PKG_NAME);
    
    if (config.gitDisable) {
        const files = await vscode.workspace.findFiles('.gitignore', null, 1);

        check = !!files.length;
    }

    return(check)
}

export function checkForOutputOption(context) {
    if (config.showDiffOutput) {
        outputController = vscode.window.createOutputChannel(PKG_LABEL, 'diff');

        context.subscriptions.push(outputController);
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

    await changeIconColor('add', gutterConfig.add);
    await changeIconColor('del', gutterConfig.del);
    await changeIconColor('change', gutterConfig.change);
}

export function changeIconColor(type: string, color: any) {
    return new Promise((resolve) => fs.writeFile(
        getImgPath(type),
        `<svg width="10" height="40" viewPort="0 0 10 40" xmlns="http://www.w3.org/2000/svg"><polygon points="5,0 10,0 10,40 5,40" fill="${color}"/></svg>`,
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
