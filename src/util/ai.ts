import { useCallback, useState } from "react";
import { MODELS, STORE_KEY } from "./consts";
import store from "./store";
import { chatComplete } from "./llm";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);

  const addPrompt = useCallback(
    async (prompt: string, temperature: number = 1.0) => {
      const model = (await store.get(STORE_KEY.MODEL)) as keyof typeof MODELS;
      const responseId = generateId();

      const onChunk = ({
        text,
        isFirst,
      }: {
        text: string;
        isFirst: boolean;
      }) => {
        if (isFirst) {
          setMessages((prev) => [
            ...prev,
            { id: responseId, role: "assistant", content: text },
          ]);
        } else {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === responseId
                ? {
                    ...message,
                    content: `${message.content}${text}`,
                  }
                : message
            )
          );
        }
      };

      const newMessages: Message[] = [
        ...messages,
        { id: generateId(), role: "user", content: prompt },
      ];

      setMessages(newMessages);

      let isFirst = true;
      await chatComplete({
        chat: newMessages,
        onChunk(message) {
          onChunk({ text: message, isFirst });
          isFirst = false;
        },
        model,
      });
    },
    [messages]
  );

  const reset = useCallback(() => setMessages([]), []);

  return {
    messages,
    addPrompt,
    reset,
  };
}
