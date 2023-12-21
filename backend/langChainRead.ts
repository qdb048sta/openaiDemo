import { Request, Response } from "express";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";
import dotenv from "dotenv";
import { projectName } from "./config";

dotenv.config();

import { getConversation } from "./langChainUtils";
import NodeCache from "node-cache";
import langChainInitializer from "./langChainInitializer";

type CacheValueType = {
  result: string;
  memory: any;
  timestamp: number;
};

const cache = new NodeCache();

/*const loader = new GithubRepoLoader("https://github.com/innovap3/js-exam", {
  branch: "main",
  recursive: false,
  unknown: "warn",
  maxConcurrency: 5, // Defaults to 2
});*/

export const langChainResponse = async (req: Request, res: Response) => {
  const model = langChainInitializer.getModel();
  const memory = langChainInitializer.getMemory();
  const retriever = langChainInitializer.getRetriever();
  try {
    const { error } = req.body;

    const cacheValue: CacheValueType | undefined = cache.get(error);
    if (cacheValue) {
      cache.set(error, { ...cacheValue, timestamp: new Date().getTime() });
      res.status(200).json({ result: cacheValue.result });
      return;
    }

    cache.set(error, { result: "pending", timestamp: new Date().getTime() });

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

    await memory?.saveContext({ input: question }, { output: result });
    cache.set(error, { result, memory, timestamp: new Date().getTime() });
    console.log(result);
    res.status(200).json({ result });
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
        return { key, value };
      })
      .sort((a, b) => b.value.timestamp - a.value.timestamp);
    res.status(200).json(result);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
