import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { env } from "../config/envs/environments";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatCohere } from "@langchain/cohere";
import { RunnableLambda } from "@langchain/core/runnables";
import { HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { llm } from "../core/llm";
import { enhanceQuery } from "./cohere.service";

//-------------------SMART--SEARCH--------------------------
export async function SmartResearch(query: string): Promise<any> {
  console.log("🔍 Iniciando SmartResearch con la consulta:", query);

  const researchTool = new TavilySearchResults({
    maxResults: 4,
    apiKey: env.tavily.tavily_api_key,
  });

  const llmWithTool = llm.bindTools([researchTool]);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Eres un asistente muy útil."],
    ["placeholder", "{messages}"],
  ]);

  const chain = prompt.pipe(llmWithTool);

  //-------------------TOOL--CHAIN---------------------------
  const toolChain = RunnableLambda.from(async (input: string, config) => {
    console.log("🟢 Iniciando Tool Chain");

    const humanMessage = new HumanMessage(String(input));
    console.log("👤 Human Message:", humanMessage);

    const aiMessage = await chain.invoke({
      messages: [humanMessage],
      config,
    });
    console.log("🧠 AI Message:", aiMessage);

    const toolMessage = await researchTool.batch(
      aiMessage.tool_calls ?? [],
      config
    );
    console.log("🔧 Tool Message:", toolMessage);

    const response = await chain.invoke({
      messages: [humanMessage, aiMessage, ...toolMessage],
    });
    console.log("🔗 Chain Response:", response);

    return response;
  });

  console.log("🟡 Ejecutando Tool Chain");

  const enhancedQuery = await enhanceQuery(query);

  const toolChainResponse = await toolChain.invoke(enhancedQuery);
  console.log("🔵 Tool Chain Response:", toolChainResponse);

  const { tool_calls, content } = toolChainResponse;
  // console.log("🟣 Tool Calls:", tool_calls);

  if (tool_calls === undefined) {
    throw new Error("No se recibió ninguna respuesta de la herramienta.");
  }

  const structuredResponse = {
    content,
    sources: tool_calls.map((call) => (call as any).source),
  };

  console.log(
    "📩 Resultado de SmartResearch:",
    JSON.stringify(structuredResponse, null, 2)
  );

  return structuredResponse;
}
