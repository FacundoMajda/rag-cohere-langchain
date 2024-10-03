import { ChatCohere } from "@langchain/cohere";
import { env } from "../config/envs/environments";

const API_KEY = env.cohere.cohere_api_key;

//-------------------LLM--SETUP------------------------//
export const llm = new ChatCohere({
  apiKey: API_KEY,
  model: "command-r-plus",
  temperature: 0.3,
  maxRetries: 2,
  // streaming: true,
});

//TODO: usar streaming
// import { concat } from "@langchain/core/utils/stream";
// const stream = await llm.stream(input);
// let full: AIMessageChunk | undefined;
// for await (const chunk of stream) {
//   full = !full ? chunk : concat(full, chunk);
// }
// console.log(full);
