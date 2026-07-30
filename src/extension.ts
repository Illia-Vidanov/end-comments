import * as vscode from "vscode"

import { Stack } from "./Stack"
import { Tokenize, IsBracket } from "./Tokenizer"

const logger = vscode.window.createOutputChannel("end-comments", { log: true});

export function activate(context: vscode.ExtensionContext) {
  logger.clear();
  const comment_current_command = vscode.commands.registerCommand("EndComments.CommentCurrent", CommentCurrent);
  const view_logs_command = vscode.commands.registerCommand("EndComments.ViewLogs", async () => { ViewLogs(context.logUri) });
  context.subscriptions.push(comment_current_command, view_logs_command);
}

async function CommentCurrent() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showWarningMessage("No active editor");
    return;
  }

  AddCommentsTo(editor.document);
}

async function ViewLogs(log_uri: vscode.Uri) {
  const logFilePath = vscode.Uri.joinPath(log_uri, `${logger.name}.log`);
  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: "Opening log file...",
    cancellable: false
  }, async (progress_indicator, token) => {
    await new Promise<void>(async (resolve) => {
      try {
        const doc = await vscode.workspace.openTextDocument(logFilePath);
        await vscode.window.showTextDocument(doc);
      }
      catch {
        vscode.window.showErrorMessage("Could not open Manim Notebook log file");
      }
      finally {
        resolve();
      }
    });
  });
}

// Reason for brace
// I'll put everything here, even if it isn't used or not language specific
enum Reason {
  kNone,
  kStructure,
  kClass,
  kUnion,
  kNamespace,
  kFunction,
  kConstructor,
  kArray,
  kInitializerList,
  kLoop,
}

function AddCommentsTo(document: vscode.TextDocument) {
  let reasons = new Stack<Reason>();
  let brackets = new Stack<string>();

  for (let line_i = 0; line_i < document.lineCount; ++line_i) {
    let line = document.lineAt(line_i);
    let tokens = Tokenize(document.getText(line.range));

    for (let token_i = 0; token_i < tokens.length; ++token_i) {
      logger.info(tokens[token_i]);
    }
  }
}