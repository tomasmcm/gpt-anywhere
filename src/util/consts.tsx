export const PROMPTS = {
  base: "You are a friendly AI assistant. Answer only the question being asked in a concise manner. Use Markdown, KaTeX, $$equations$$, and emojis when appropriate.",
  linuxTerminal:
    "Act as a hypothetical Linux terminal. Only provide the output of commands I give you. Do not include anything else. Use Markdown code blocks to format output.",
  python:
    "Act as a hypothetical Python interpreter. Do not ask for more information. Assume all files/libraries are present. Only provide the output of code I give you. Do not include anything else. Use Markdown code blocks to format output.",
} as const;

export const MODELS = {
  "gpt-4-turbo": "GPT-4 Turbo",
  "gpt-4o": "GPT-4o",
  "claude-3-5-sonnet-20240620": "Claude 3 Sonnet",
  "claude-3-haiku-20240307": "Claude 3 Haiku",
} as const;

export const SYSTEM_PROMPT = PROMPTS.base;
export const DEFAULT_MAX_TOKENS = 1000;
export const DEFAULT_TIMEOUT = 10;
export const DEFAULT_OPENAI_BASE_URL="https://api.openai.com";

export const STORE_KEY = {
  OPENAI_API_KEY: "openai_api_key",
  OPENAI_BASE_URL: "openai_base_url",
  ANTHROPIC_API_KEY: "anthropic_api_key",
  MAX_TOKENS: "max_length",
  TIMEOUT: "timeout",
  MODEL: "model",
} as const;

export const FIRST_LOAD_TEXT = `
## Welcome to GPT Anywhere!

Use the text box above to interact with GPT.  This window can be toggled at any time using the shortcut \`Ctrl+Shift+/\` or \`Cmd+Shift+/\` (on Mac).

Before you get started, open the settings menu and enter your API key. You can get an API key from [OpenAI](https://platform.openai.com/account/api-keys).
`;

export const fillerMarkdown = `
# Welcome to the React Markdown Previewer!

## This is a sub-heading...

### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`rust
// this is multi-line code:

fn fib(n: u32) -> u32 {
  if n <= 1 {
    return n;
  }
  fib(n - 1) + fib(n - 2)
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

$$ \\frac{1}{n^{2}} $$

- Bullet list

- With spacing

- And more spacing

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.
        
![React Logo w/ Text](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png)

`;
