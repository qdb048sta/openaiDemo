import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "langchain/schema/output_parser";

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

export const getConversation = ({
  model,
  errorStack,
  retriever,
  memory,
  projectName,
}: any) => {
  const combineDocumentsChain = RunnableSequence.from([
    {
      question: (output) => output,
      error: () => errorStack,
      chat_history: async () => {
        const { chat_history } = await memory.loadMemoryVariables({});
        return chat_history;
      },
      context: async (output) => {
        const textForRag = `${output.rephrasedQuestion}\nError Stack: ${errorStack}`;
        const relevantDocs = await retriever.getRelevantDocuments(textForRag);
        const formattedDocs = relevantDocs.map((doc: any) => {
          const path = doc.metadata.source.split(projectName)[1];
          const newPageContent = `// ${path}\n\n${doc.pageContent}\n`;
          return { ...doc, pageContent: newPageContent };
        });
        return formatDocumentsAsString(formattedDocs);
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
  return conversationalQaChain;
};
