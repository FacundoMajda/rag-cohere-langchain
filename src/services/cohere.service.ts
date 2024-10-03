import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llm } from "../core/llm";
import { ENHANCE_QUERY_PREAMBLE } from "../common/preambles/enhance_query";
import { AIMessageChunk } from "@langchain/core/messages";

export async function enhanceQuery(userQuery: string): Promise<string> {
  console.log("🌐 Iniciando langchainWithCohere");

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", ENHANCE_QUERY_PREAMBLE],
    ["human", "{query}"],
  ]);

  const chain = prompt.pipe(llm);

  const res = await chain.invoke({
    query: userQuery,
  });

  const enhancedQuery = res.content.toString();
  return enhancedQuery;
}
