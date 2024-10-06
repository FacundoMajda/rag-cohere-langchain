import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "../config/envs/environments";

export async function interactWithPDF(pdfFilePath: string) {
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: env.gemini.gemini_api_key,
    temperature: 0.3,
    maxRetries: 2,
  });

  const pdfLoader = new PDFLoader(pdfFilePath, {
    // parsedItemSeparator: "",
  });

  async function loadPDF(loader: PDFLoader) {
    const document = await loader.load();
    const pagesContent = document.map((page) => page.pageContent);
    return pagesContent;
  }

  async function interactWithPDFContent(content: any) {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful assistant that can read and understand PDF documents.",
      ],
      ["human", `What is the content of the document? {document_content}`],
    ]);

    const chain = prompt.pipe(llm);

    const interactionResult = await chain.invoke({
      document_content: content,
    });

    return interactionResult;
  }

  const content = await loadPDF(pdfLoader);
  const result = await interactWithPDFContent(content);
  return result;
}
