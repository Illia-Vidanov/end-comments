export function Tokenize(text: string): string[]
{
  if(text.length == 0)
    return [];

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
      return ["Internal error, unknown state"];
    }
  }

  return tokens;
}

export function IsText(char: string): boolean
{
  return char.match(/^\w$/) != null;
}

export function IsSpace(char: string): boolean
{
  return char.match(/^\s$/) != null;
}

export function IsBracket(char: string): boolean
{
  return char.match(/^[\[\]\{\}\(\)]$/) != null;
}