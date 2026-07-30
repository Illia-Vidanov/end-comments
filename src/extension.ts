import * as vscode from "vscode"

import { Stack } from "./Stack"
import { Tokenize } from "./Tokenizer"

export function activate(context: vscode.ExtensionContext)
{
  const comment_current_command = vscode.commands.registerCommand("EndComments.CommentCurrent", CommentCurrent);
  context.subscriptions.push(comment_current_command);
}

async function CommentCurrent()
{
  const editor = vscode.window.activeTextEditor;

  if(!editor)
  {
    vscode.window.showWarningMessage("No active editor");
    return;
  }

  AddCommentsTo(editor.document);
}

// Reason for brace
// I'll put everything here, even if it isn't used or not language specific
enum Reason
{
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

function AddCommentsTo(document: vscode.TextDocument)
{
  let reasons = new Stack<Reason>();

  for(let i = 0; i < document.lineCount; ++i)
  {
    let line = document.lineAt(i);
    let tokens = Tokenize(document.getText(line.range));
  }
}