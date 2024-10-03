import { CohereClient } from "cohere-ai";
import { env } from "../config/envs/environments";

export async function chatWithCohere(prompt: string): Promise<string> {
  const cohere = new CohereClient({ token: env.cohere.cohere_api_key });

  try {
    const response = await cohere.chatStream({
      preamble: "",
      model: "command-r-plus",
      promptTruncation: "AUTO",
      temperature: 0.3,
      message: prompt,
      chatHistory: [],
      connectors: [{ id: "web-search" }],
    });

    let responseText = "";
    for await (const chat of response) {
      if (chat.eventType === "text-generation") {
        responseText += chat.text;
      }
    }

    if (!responseText) {
      throw new Error("No se recibió ninguna respuesta del chatbot.");
    }

    return responseText;
  } catch (error) {
    throw new Error(`Error en la comunicación con Cohere: ${error}`);
  }
}
