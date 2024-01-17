import { Request, Response } from "express";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import dotenv from "dotenv";
import { projectName } from "./config";

dotenv.config();

import { getConversation } from "./langChainUtils";
import NodeCache from "node-cache";
import langChainInitializer from "./langChainInitializer";
import { BufferMemory } from "langchain/memory";
import { AIMessage, HumanMessage } from "langchain/schema";

type CacheValueType = {
  status: "success" | "pending" | "error";
  memory: BufferMemory;
  timestamp: number;
};

const cache = new NodeCache();

/*const loader = new GithubRepoLoader("https://github.com/innovap3/js-exam", {
  branch: "main",
  recursive: false,
  unknown: "warn",
  maxConcurrency: 5, // Defaults to 2
});*/

const invokeLlm = async (error: string, input: string) => {
  const cacheValue: CacheValueType | undefined = cache.get(error);
  const memory =
    cacheValue?.memory ||
    new BufferMemory({ returnMessages: true, memoryKey: "chat_history" });
  const model = langChainInitializer.getModel();
  const retriever = langChainInitializer.getRetriever();
  cache.set<CacheValueType>(error, {
    memory,
    status: "pending",
    timestamp: new Date().getTime(),
  });
  try {
    const { stack: errorStack } = JSON.parse(error);
    const conversationChain = getConversation({
      model,
      errorStack,
      retriever,
      memory,
      projectName,
      inputType,
    });
    const result = await conversationChain.invoke({ question: input });
    await memory?.saveContext({ input }, { output: result });
    cache.set<CacheValueType>(error, {
      status: "success",
      memory,
      timestamp: new Date().getTime(),
    });
    return result;
  } catch (err: any) {
    const { message } = err;
    console.error(message);
    cache.set<CacheValueType>(error, {
      status: "error",
      memory,
      timestamp: new Date().getTime(),
    });
  }
};

const getFirstQuestion = (error: string) => {
  const { message: errorMessage } = JSON.parse(error);
  const question = `I have the following error message: \"${errorMessage}\"\nCan you help to analyze the problem and give us at least one code example`;
  return question;
};

const refreshCacheTime = (key: string) => {
  const cacheValue: CacheValueType | undefined = cache.get(key);
  if (!cacheValue) return;
  cache.set(key, { ...cacheValue, timestamp: new Date().getTime() });
};

export const langChainResponse = async (
  req: Request<unknown, unknown, { error: string; input: string }>,
  res: Response
) => {
  try {
    const { error, input } = req.body;
    const cacheValue: CacheValueType | undefined = cache.get(error);
    if (!cacheValue) {
      const input = getFirstQuestion(error);
      await invokeLlm(error, input);
      res.status(200).json({ status: "success" });
      return;
    } else if (!input) {
      refreshCacheTime(error);
      res.status(200).json({ status: cacheValue.status });
      return;
    } else {
      await invokeLlm(error, input);
      res.status(200).json({ status: "success" });
      return;
    }
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const getAllConversation = async (req: Request, res: Response) => {
  try {
    const result = cache
      .keys()
      .map((key) => {
        const value = cache.get(key) as CacheValueType;
        const memory = (value.memory?.chatHistory as any)?.messages.map(
          (v: any) => {
            if (v instanceof AIMessage) {
              return { from: "ai", content: v.content };
            }
            if (v instanceof HumanMessage) {
              return { from: "user", content: v.content };
            }
          }
        );
        return { key, ...value, memory };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
