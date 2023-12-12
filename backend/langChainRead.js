import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import dotenv from "dotenv";
dotenv.config();
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import * as fs from "fs";
import { StringOutputParser } from "langchain/schema/output_parser";
import { getConversation } from "./langChainUtils.js";
import NodeCache from "node-cache";

const cache = new NodeCache();
const projectName = "example-error-app";
const REPO_PATH = `../${projectName}/src`;

//loading code
const loader = new DirectoryLoader(REPO_PATH, {
  ".js": (path) => new TextLoader(path),
  ".jsx": (path) => new TextLoader(path),
  ".ts": (path) => new TextLoader(path),
  ".tsx": (path) => new TextLoader(path),
  ".json": (path) => new TextLoader(path),
  ".snap": (path) => new TextLoader(path),
  ".scss": (path) => new TextLoader(path),
  ".json": (path) => new TextLoader(path),
  ".html": (path) => new TextLoader(path),
  ".css": (path) => new TextLoader(path),
});

/*const loader = new GithubRepoLoader("https://github.com/innovap3/js-exam", {
  branch: "main",
  recursive: false,
  unknown: "warn",
  maxConcurrency: 5, // Defaults to 2
});*/
const docs = await loader.load();
const javascriptSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
  chunkSize: 2000,
  chunkOverlap: 200,
});
const texts = await javascriptSplitter.splitDocuments(docs);

console.log("Loaded ", texts.length, " documents.");

const directory = "../backend/vectorStore/";
const faissFile = directory + "faiss.index";
let vectorStore;
try {
  fs.accessSync(faissFile, fs.constants.F_OK);
  vectorStore = await FaissStore.load(directory, new OpenAIEmbeddings());
  console.log("loaded from file");
} catch {
  vectorStore = await FaissStore.fromDocuments(texts, new OpenAIEmbeddings(), {
    tableName: "documents",
    queryName: "match_documents",
  });
  await vectorStore.save(directory);
}

const retriever = vectorStore.asRetriever();
const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" }).pipe(
  new StringOutputParser()
);
const memory = new BufferMemory({
  returnMessages: true, // Return stored messages as instances of `BaseMessage`
  memoryKey: "chat_history", // This must match up with our prompt template input variable.
});

export const langChainResponse = async (req, res) => {
  try {
    const { error } = req.body;

    const cacheValue = cache.get(error);
    if (cacheValue) {
      res.status(200).json({ result: cacheValue.result });
      return;
    }

    cache.set(error, { result: "pending" });

    const { message: errorMessage, stack: errorStack } = JSON.parse(error);

    const conversationChain = getConversation({
      model,
      errorStack,
      retriever,
      memory,
      projectName,
    });
    const question = `I have the following error message: \"${errorMessage}\"\nCan you help to analyze the problem and give us at least one code example`;
    const result = await conversationChain.invoke({ question });

    await memory.saveContext({ input: question }, { output: result });
    cache.set(error, { result, memory });
    console.log(result);
    res.status(200).json({ result });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAllConversation = async (req, res) => {
  try {
    const result = cache.keys().map((key) => {
      const value = cache.get(key);
      return { key, value };
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
