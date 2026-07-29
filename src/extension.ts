import * as vscode from "vscode"

import { Stack } from "./Stack"

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

function Tokenize(text: string): string[]
{
  let tokens: string[] = [];
  enum State
  {
    kNone,
    kText, //inclusive numbers
    kSigns, // multiple signs accepted, we don't care about those
    kSpace,
    kBracket
  }

  let state = State.kNone;
  let token = -1;
  let once = false;
  for(let i = 0; i < text.length + 1; ++i)
  {
    switch(state)
    {
    case State.kNone:
      once = true;
      if(IsText(text[i]))
        state = State.kText;
      else if(IsSpace(text[i]))
        state = State.kSpace;
      else if(IsBracket(text[i]))
        state = State.kBracket;
      else
        state = State.kSigns;
      break;

    case State.kText:
      if(once)
      {
        tokens.push("");
        ++token;
        tokens[token] += text[i-1];
        once = false;
      }

      if(i == text.length)
        break;

      if(IsText(text[i]))
      {
        tokens[token] += text[i];
        continue;
      }

      once = true;
      if(IsSpace(text[i]))
        state = State.kSpace;
      else if(IsBracket(text[i]))
        state = State.kBracket;
      else
        state = State.kSigns;
      break;
    
    case State.kBracket:
      tokens.push("");
      ++token;
      tokens[token] += text[i-1];

      if(i == text.length)
        break;

      if(IsBracket(text[i]))
        continue;

      once = true;
      if(IsText(text[i]))
        state = State.kText;
      else if(IsSpace(text[i]))
        state = State.kSpace;
      else
        state = State.kSigns;
      break;

    case State.kSpace:
      if(once)
      {
        tokens.push("");
        ++token;
        tokens[token] += text[i-1];
        once = false;
      }

      if(i == text.length)
        break;

      if(IsSpace(text[i]))
      {
        tokens[token] += text[i];
        continue;
      }

      once = true;
      if(IsText(text[i]))
        state = State.kText;
      else if(IsBracket(text[i]))
        state = State.kBracket;
      else
        state = State.kSigns;
      break;
    
    case State.kSigns:
      if(once)
      {
        tokens.push("");
        ++token;
        tokens[token] += text[i-1];
        once = false;
      }

      if(i == text.length)
        break;

      if(IsText(text[i]))
        state = State.kText;
      else if(IsBracket(text[i]))
        state = State.kBracket;
      else if(IsSpace(text[i]))
        state = State.kSpace;
      else // if it's a sign
      {
        tokens[token] += text[i];
        continue;
      }
      once = true;
      break;
    
    default:
      vscode.window.showErrorMessage("Internal error: unknown State");
      break;
    }
  }

  return tokens;
}

function IsText(char: string): boolean
{
  return char.match(/^\w$/) != null;
}

function IsSpace(char: string): boolean
{
  return char.match(/^\s$/) != null;
}

function IsBracket(char: string): boolean
{
  return char.match(/^[\[\]\{\}\(\)]$/) != null;
}