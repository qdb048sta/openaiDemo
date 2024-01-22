import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "langchain/schema/output_parser";
import { BaseLanguageModelInput } from "langchain/dist/base_language";
import { VectorStoreRetriever } from "langchain/dist/vectorstores/base";
import { FaissStore } from "langchain/vectorstores/faiss";
import { BufferMemory } from "langchain/memory";

const questionGeneratorTemplate = ChatPromptTemplate.fromMessages([
  AIMessagePromptTemplate.fromTemplate(
    "Given the following conversation about a codebase and a follow up question, rephrase the follow up question to be a standalone question."
  ),
  new MessagesPlaceholder("chat_history"),
  AIMessagePromptTemplate.fromTemplate(`Follow Up Input: {question}
Standalone question:`),
]);
const combineDocumentsPrompt = ChatPromptTemplate.fromMessages([
  AIMessagePromptTemplate.fromTemplate(
    "Use the following pieces of codebase and the error stack to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\n"
  ),
  new MessagesPlaceholder("chat_history"),
  HumanMessagePromptTemplate.fromTemplate(
    "\n\nError stack: {error}\n\nQuestion: {question}"
  ),
]);
const followingDocumentsPrompt = ChatPromptTemplate.fromMessages([
  AIMessagePromptTemplate.fromTemplate(
    "This is the followup question based on your previous response. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\n"
  ),
  new MessagesPlaceholder("chat_history"),
  HumanMessagePromptTemplate.fromTemplate(
    "Question: {question} original question:"
  ),
]);
// We can have a object in future for different purpose prompt i.g {standalone: combineDocumentsPrompt , followup:followingDocumentsPrompt}
export const getConversation = ({
  model,
  errorStack,
  retriever,
  memory,
  projectName,
  inputType = "standalone",
}: {
  model: RunnableSequence<BaseLanguageModelInput, string>;
  retriever: VectorStoreRetriever<FaissStore> | null;
  projectName: string;
  memory: BufferMemory;
  errorStack: string;
  inputType: string;
}) => {
  const AIresponseprompt =
    inputType == "standalone"
      ? combineDocumentsPrompt
      : followingDocumentsPrompt;
  const combineDocumentsChain = RunnableSequence.from([
    {
      question: (output) => output,
      error: () => errorStack,
      chat_history: async () => {
        const { chat_history } = await memory.loadMemoryVariables({});
        return chat_history;
      },
      context: async (output) => {
        const textForRag = `${output}\nError Stack: ${errorStack}`;
        const relevantDocs =
          (await retriever?.getRelevantDocuments(textForRag)) || [];
        const formattedDocs = relevantDocs.map((doc) => {
          const path = doc.metadata.source.split(projectName)[1];
          const newPageContent = `// ${path}\n\n${doc.pageContent}\n`;
          return { ...doc, pageContent: newPageContent };
        });
        return formatDocumentsAsString(formattedDocs);
      },
    },
    AIresponseprompt,
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
  return conversationalQaChain;
};
