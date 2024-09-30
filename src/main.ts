import { ChatCohere } from "@langchain/cohere";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { env } from "./config/envs/environments.js";

const llm = new ChatCohere({
  apiKey: env.cohere.cohere_api_key,
  model: "command-r-plus",
  temperature: 0.3,
  maxRetries: 2,
});

async function langchainWithCohere() {
  console.log("🌐 Iniciando langchainWithCohere");

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Eres un asistente útil que traduce {input_language} a {output_language}.",
    ],
    ["human", "{input}"],
  ]);

  console.log("📝 Prompt configurado en langchainWithCohere:", prompt);

  const chain = prompt.pipe(llm);

  console.log("🔗 Cadena configurada en langchainWithCohere:", chain);

  const res = await chain.invoke({
    input_language: "Español",
    output_language: "Francés",
    input: "RAG es la mejor estrategia disponible para la ia generativa.",
  });

  console.log("🌐 Resultado de LangChain:", res);
  return res;
}

async function executeChain(query: string) {
  const tool = new TavilySearchResults({
    maxResults: 3,
    apiKey: process.env.TAVILY_API_KEY,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant."],
    ["placeholder", "{messages}"],
  ]);

  const llmWithTools = llm.bindTools([tool]);

  const chain = prompt.pipe(llmWithTools);

  const toolChain = RunnableLambda.from(async (userInput, config) => {
    const humanMessage = new HumanMessage(String(userInput));

    const aiMsg = await chain.invoke(
      {
        messages: [humanMessage],
      },
      config
    );

    const toolMsgs = await tool.batch(aiMsg.tool_calls ?? [], config);

    const finalResult = await chain.invoke(
      {
        messages: [humanMessage, aiMsg, ...toolMsgs],
      },
      config
    );

    return finalResult;
  });

  const toolChainResult = await toolChain.invoke(query);

  const { tool_calls, content } = toolChainResult;

  console.log(
    "AIMessage",
    JSON.stringify(
      {
        tool_calls,
        content,
      },
      null,
      2
    )
  );
}

executeChain(
  "¿cual fue el mejor auto que diseñó Adrian Newey durante su trayectoria en la f1?sabiendo esto, quiero que luego contestes, en que carreras tuvo su mejor tiempo en vueltas rápidas?"
);
