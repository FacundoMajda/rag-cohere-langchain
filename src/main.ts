// import { ChatCohere } from "@langchain/cohere";
// import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
// import { HumanMessage } from "@langchain/core/messages";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { RunnableLambda } from "@langchain/core/runnables";
// import { env } from "./config/envs/environments.js";

import { enhanceQuery } from "./services/cohere.service";
import { SmartResearch } from "./services/research.service";

// const llm = new ChatCohere({
//   apiKey: env.cohere.cohere_api_key,
//   model: "command-r-plus",
//   temperature: 0.3,
//   maxRetries: 2,
// });

// async function langchainWithCohere() {
//   console.log("🌐 Iniciando langchainWithCohere");

//   const prompt = ChatPromptTemplate.fromMessages([
//     [
//       "system",
//       "Eres un asistente útil que traduce {input_language} a {output_language}.",
//     ],
//     ["human", "{input}"],
//   ]);

//   console.log("📝 Prompt configurado en langchainWithCohere:", prompt);

//   const chain = prompt.pipe(llm);

//   console.log("🔗 Cadena configurada en langchainWithCohere:", chain);

//   const res = await chain.invoke({
//     input_language: "Español",
//     output_language: "Francés",
//     input: "RAG es la mejor estrategia disponible para la ia generativa.",
//   });

//   console.log("🌐 Resultado de LangChain:", res);
//   return res;
// }
// async function executeChain(query: string) {
//   console.log("🔍 1. Iniciando executeChain con la consulta:", query);

//   const tool = new TavilySearchResults({
//     maxResults: 3,
//     apiKey: process.env.TAVILY_API_KEY,
//   });

//   console.log("🔧 2. Herramienta TavilySearchResults configurada:", tool);

//   const prompt = ChatPromptTemplate.fromMessages([
//     ["system", "You are a helpful assistant."],
//     ["placeholder", "{messages}"],
//   ]);

//   console.log("📝 3. Prompt configurado en executeChain:", prompt);

//   const llmWithTools = llm.bindTools([tool]);

//   console.log("🤖 4. LLM con herramientas configurado:", llmWithTools);

//   const chain = prompt.pipe(llmWithTools);

//   console.log("🔗 5. Cadena configurada en executeChain:", chain);

//   const toolChain = RunnableLambda.from(async (userInput, config) => {
//     const humanMessage = new HumanMessage(String(userInput));

//     const aiMsg = await chain.invoke(
//       {
//         messages: [humanMessage],
//       },
//       config
//     );

//     console.log("📩 8. Mensaje de IA recibido:", aiMsg);

//     const toolMsgs = await tool.batch(aiMsg.tool_calls ?? [], config);

//     console.log("🔧 9. Mensajes de la herramienta recibidos:", toolMsgs);

//     const finalResult = await chain.invoke(
//       {
//         messages: [humanMessage, aiMsg, ...toolMsgs],
//       },
//       config
//     );

//     console.log("🏁 10. Resultado final de chain.invoke:", finalResult);

//     return finalResult;
//   });

//   console.log("🔗 11. ToolChain configurado:", toolChain);

//   const toolChainResult = await toolChain.invoke(query);

//   console.log("🔗 12. Resultado de ToolChain:", toolChainResult);

//   const { tool_calls, content } = toolChainResult;

//   // console.log(
//   //   "📩 13. AIMessage",
//   //   JSON.stringify(
//   //     {
//   //       tool_calls,
//   //       content,
//   //     },
//   //     null,
//   //     2
//   //   )
//   // );
// }

SmartResearch("dolar argentina precio");
