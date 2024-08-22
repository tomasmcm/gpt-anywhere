import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { Message } from "./ai";
import {
  SYSTEM_PROMPT,
  DEFAULT_MAX_TOKENS,
  STORE_KEY,
  DEFAULT_TIMEOUT,
  DEFAULT_OPENAI_BASE_URL,
} from "./consts";
import store from "./store";

type SendRequestFn = (
  chat: Message[],
  model: string,
  temperature?: number
) => Promise<{
  url: string;
  headers: Record<string, string>;
  body: string;
}>;

const getRequestData: SendRequestFn = async (
  chat,
  model,
  temperature
) => {
  if (model.includes("claude")) {
    return getAnthropicRequestData(chat, model, temperature)
  } else {
    return getOpenAIRequestData(chat, model, temperature)
  }
}

const getOpenAIRequestData: SendRequestFn = async (
  chat,
  model,
  temperature
) => {
  const apiKey = await store.get(STORE_KEY.OPENAI_API_KEY);
  const max_tokens =
    Number(await store.get(STORE_KEY.MAX_TOKENS)) || DEFAULT_MAX_TOKENS;
  const baseUrl = (await store.get(STORE_KEY.OPENAI_BASE_URL)) || DEFAULT_OPENAI_BASE_URL;

  const apiChat = chat.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  return {
    url: `${baseUrl}/v1/chat/completions`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...apiChat,
      ],
      stream: true,
      max_tokens,
      temperature,
    }),
  }
};

const getAnthropicRequestData: SendRequestFn = async (
  chat,
  model,
  temperature
) => {
  const apiKey = await store.get(STORE_KEY.ANTHROPIC_API_KEY);
  const max_tokens =
    Number(await store.get(STORE_KEY.MAX_TOKENS)) || DEFAULT_MAX_TOKENS;

  const apiChat = chat.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  return {
    url: "https://api.anthropic.com/v1/messages/",
    headers: {
      "x-api-key": apiKey as string,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      system: SYSTEM_PROMPT,
      messages: apiChat,
      stream: true,
      max_tokens,
      temperature,
    }),
  }
};

async function chatComplete({
  chat,
  onChunk,
  model,
  temperature = 0.8,
}: {
  chat: Message[];
  onChunk: (message: string) => void;
  model: string;
  temperature?: number;
}) {
  let finalMessage = "";

  // Set up listener for stream chunks
  const unlisten = await listen('stream-chunk', (event: any) => {
    const chunk = event.payload;
    console.log('chunk', chunk)
    try {
      const lines = chunk.split('\n').filter((line: string) => line.trim() !== '');
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        console.log("line starts with data: ")
        const message = line.replace(/^data:\s*/, '').trim();
        if (!message.startsWith('{') || !message.endsWith('}')) continue;
        console.log("message is JSON")
        try {
          const parsed = JSON.parse(message);
          console.log("parsed", parsed)
          const content = parsed?.choices?.[0]?.delta?.content ||
            parsed?.delta?.text || null;
          if (content) {
            finalMessage += content;
            onChunk(content);
          }
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          console.log(line)
        }
      }
    } catch (error) {
      console.error('Error processing chunk:', error);
    }
  });

  try {
    const params = await getRequestData(chat, model, temperature);
    await invoke('stream_request', { params });
  } catch (error) {
    console.error("Error in stream request:", error);
    throw error;
  } finally {
    await unlisten();
  }

  return finalMessage;
}

export { chatComplete };
