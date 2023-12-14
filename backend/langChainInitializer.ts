import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { StringOutputParser } from "langchain/schema/output_parser";
import { REPO_PATH } from "./config";

class LangChainInitializer {
  private docs: any = null;
  private model: any = null;
  private memory: any = null;
  private retriever: any = null;

  private initialized: boolean = false;

  async init() {
    if (this.initialized) {
      return;
    }
    //loading code
    const loader = new DirectoryLoader(REPO_PATH, {
      ".js": (path) => new TextLoader(path),
      ".jsx": (path) => new TextLoader(path),
      ".ts": (path) => new TextLoader(path),
      ".tsx": (path) => new TextLoader(path),
      ".json": (path) => new TextLoader(path),
      ".snap": (path) => new TextLoader(path),
      ".scss": (path) => new TextLoader(path),
      ".html": (path) => new TextLoader(path),
      ".css": (path) => new TextLoader(path),
    });
    this.docs = await loader.load();
    const javascriptSplitter = RecursiveCharacterTextSplitter.fromLanguage(
      "js",
      {
        chunkSize: 2000,
        chunkOverlap: 200,
      }
    );
    const texts = await javascriptSplitter.splitDocuments(this.docs);

    console.log("Loaded ", texts.length, " documents.");

    const vectorStore = await MemoryVectorStore.fromDocuments(
      texts,
      new OpenAIEmbeddings()
    );
    this.retriever = vectorStore.asRetriever();
    this.model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" }).pipe(
      new StringOutputParser()
    );
    this.memory = new BufferMemory({
      returnMessages: true, // Return stored messages as instances of `BaseMessage`
      memoryKey: "chat_history", // This must match up with our prompt template input variable.
    });
  }
  getDocs() {
    return this.docs;
  }

  getModel() {
    return this.model;
  }

  getMemory() {
    return this.memory;
  }

  getRetriever() {
    return this.retriever;
  }
}

const langChainInitializer = new LangChainInitializer();
export default langChainInitializer;
