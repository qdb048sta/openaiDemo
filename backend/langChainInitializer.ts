import * as fs from "fs";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { StringOutputParser } from "langchain/schema/output_parser";
import { REPO_PATH } from "./config";
import { RunnableSequence } from "langchain/schema/runnable";
import { BaseLanguageModelInput } from "langchain/dist/base_language";
import { VectorStoreRetriever } from "langchain/dist/vectorstores/base";

class LangChainInitializer {
  private model: RunnableSequence<BaseLanguageModelInput, string>;
  private retriever: VectorStoreRetriever<FaissStore> | null = null;

  private initialized: boolean = false;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
    }).pipe(new StringOutputParser());
  }

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
    const docs = await loader.load();
    const javascriptSplitter = RecursiveCharacterTextSplitter.fromLanguage(
      "js",
      {
        chunkSize: 2000,
        chunkOverlap: 200,
      }
    );
    const texts = await javascriptSplitter.splitDocuments(docs);

    console.log("Loaded ", texts.length, " documents.");
    const directory = "./vectorStore/";
    const faissFile = directory + "faiss.index";
    let vectorStore;
    try {
      fs.accessSync(faissFile, fs.constants.F_OK);
      vectorStore = await FaissStore.load(directory, new OpenAIEmbeddings());
      console.log("loaded from file");
    } catch {
      vectorStore = await FaissStore.fromDocuments(
        texts,
        new OpenAIEmbeddings()
      );
      await vectorStore.save(directory);
    }
    this.retriever = vectorStore.asRetriever();
  }

  getModel() {
    return this.model;
  }

  getRetriever() {
    return this.retriever;
  }
}

const langChainInitializer = new LangChainInitializer();
export default langChainInitializer;
