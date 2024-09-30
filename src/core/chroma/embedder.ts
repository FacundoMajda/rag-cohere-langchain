import { ChromaClientParams, CohereEmbeddingFunction } from "chromadb";
import { ChromaClient } from "chromadb";
import { env } from "../../config/envs/environments";

const ChromaClientOptions: ChromaClientParams = {
  path: "http://localhost:8000",
  auth: { provider: "api-key" },
  database: "chroma",
  tenant: "public",
};

const client = new ChromaClient(ChromaClientOptions);

const embedder = new CohereEmbeddingFunction({
  cohere_api_key: String(env.cohere.cohere_api_key),
  model: "embed-multilingual-light-v3.0",
  // inputType: "classification", // <- usar embed multilingual 2.0
});

export const generateEmbeddings = async (
  documents: string[]
): Promise<number[][]> => {
  try {
    const embeddings = await embedder.generate(documents);
    return embeddings;
  } catch (error) {
    throw error;
  }
};

export const createCollection = async (name: string) => {
  try {
    const collection = await client.createCollection({
      name,
      //usar embedder de cohere
      embeddingFunction: embedder,
      // algoritmo de recuperacion
      metadata: { "hnsw:space": "cosine" },
    });
    return collection;
  } catch (error) {
    console.error("Error al crear la colección:", error);
    throw error;
  }
};

export const getCollection = async (name: string) => {
  try {
    const collection = await client.getCollection({
      name,
      embeddingFunction: embedder,
    });
    return collection;
  } catch (error) {
    console.error("Error al obtener la colección:", error);
    throw error;
  }
};

interface Document {
  content: string;
  metadata: { [key: string]: any };
  id: string;
}

export const addDocumentsToCollection = async (
  collectionName: string,
  documents: Document[]
): Promise<any> => {
  try {
    let collection;
    try {
      collection = await getCollection(collectionName);
    } catch (error: any) {
      if (error.message.includes("does not exist")) {
        collection = await createCollection(collectionName);
      } else {
        throw error;
      }
    }

    const response = await collection.add({
      documents: documents.map((document) => document.content),
      metadatas: documents.map((document) => document.metadata),
      ids: documents.map((document) => document.id),
    });
    return response;
  } catch (error) {
    console.error(
      `Error al agregar documentos a la colección "${collectionName}":`,
      error
    );
    throw error;
  }
};
