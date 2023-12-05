import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import dotenv from "dotenv";
dotenv.config();
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "langchain/schema/output_parser";

const REPO_PATH = "/Users/johnny.wu/test-error-app/src";

//loading code
/*const loader = new DirectoryLoader(REPO_PATH, {
  ".js": (path) => new TextLoader(path),
  ".ts": (path) => new TextLoader(path),
  ".json": (path) => new TextLoader(path),
  ".snap": (path) => new TextLoader(path),
  ".scss": (path) => new TextLoader(path),
  ".json": (path) => new TextLoader(path),
  ".html": (path) => new TextLoader(path),
  ".css": (path) => new TextLoader(path),
});*/
const loader = new GithubRepoLoader("https://github.com/innovap3/js-exam", {
  branch: "main",
  recursive: false,
  unknown: "warn",
  maxConcurrency: 5, // Defaults to 2
});
const docs = await loader.load();
const javascriptSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
  chunkSize: 2000,
  chunkOverlap: 200,
});
const texts = await javascriptSplitter.splitDocuments(docs);

console.log("Loaded ", texts.length, " documents.");

const vectorStore = await MemoryVectorStore.fromDocuments(
  texts,
  new OpenAIEmbeddings(),
  {
    tableName: "documents",
    queryName: "match_documents",
  }
);
const retriever = vectorStore.asRetriever();
const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" }).pipe(
  new StringOutputParser()
);
const memory = new BufferMemory({
  returnMessages: true, // Return stored messages as instances of `BaseMessage`
  memoryKey: "chat_history", // This must match up with our prompt template input variable.
});

const questionGeneratorTemplate = ChatPromptTemplate.fromMessages([
  AIMessagePromptTemplate.fromTemplate(
    "Given the following conversation about a codebase and a follow up question, rephrase the follow up question to be a standalone question and give some suggestision."
  ),
  new MessagesPlaceholder("chat_history"),
  AIMessagePromptTemplate.fromTemplate(`Follow Up Input: {question}
Standalone question:`),
]);
const combineDocumentsPrompt = ChatPromptTemplate.fromMessages([
  AIMessagePromptTemplate.fromTemplate(
    "Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\n"
  ),
  new MessagesPlaceholder("chat_history"),
  HumanMessagePromptTemplate.fromTemplate("Question: {question}"),
]);

const combineDocumentsChain = RunnableSequence.from([
  {
    question: (output) => output,
    chat_history: async () => {
      const { chat_history } = await memory.loadMemoryVariables({});
      return chat_history;
    },
    context: async (output) => {
      const relevantDocs = await retriever.getRelevantDocuments(output);
      return formatDocumentsAsString(relevantDocs);
    },
  },
  combineDocumentsPrompt,
  model,
  new StringOutputParser(),
]);

const conversationalQaChain = RunnableSequence.from([
  {
    question: (i) => i.question,
    chat_history: async () => {
      const { chat_history } = await memory.loadMemoryVariables({});
      return chat_history;
    },
  },
  questionGeneratorTemplate,
  model,
  new StringOutputParser(),
  combineDocumentsChain,
]);

export const langChainResponse = async (req, res) => {
  try {
    const { errorComponent, errorCode } = req.body;
    const question = `I have the following error component : ${errorComponent}can you help to do the code review and give me some code example `;
    const result = await conversationalQaChain.invoke({
      question,
    });
    await memory.saveContext(
      {
        input: question,
      },
      {
        output: result,
      }
    );

    console.log(result);
    res.status(200).json({ message: result });
    //res.status(200).json({ successful: "test" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
