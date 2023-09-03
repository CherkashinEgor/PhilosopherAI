import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { OpenAI } from 'langchain/llms/openai'
import { loadQAStuffChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { SystemMessage, HumanMessage, ChatMessage, BaseChatMessageHistory, AIMessage } from 'langchain/schema'
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from 'langchain/prompts'
import { LLMChain } from 'langchain'
import { Document } from 'langchain/document'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { ConversationChain } from 'langchain/chains'
import { PineconeLibArgs, PineconeStore } from 'langchain/vectorstores/pinecone';
import { PineconeClient } from '@pinecone-database/pinecone';

type MessageType = {
  message: string;
  type: string;
};

interface MatchMetadata {
  text: string;
  // ... other properties
}

interface Match {
  metadata: MatchMetadata;
  // ... other properties
}


export const queryPineconeVectorStoreAndQueryLLM = async (
  client: PineconeClient,
  indexName: string,
  question: string,
  philosopher: string,
  history: MessageType[][]
) => {
  // 1. Start query process
  console.log('Querying Pinecone vector store...');
  // 2. Retrieve the Pinecone index
  const index = client.Index(indexName);
  // 3. Create query embedding
  const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question)
  // 4. Query Pinecone index and return top 10 matches
  let queryResponse = await index.query({
    queryRequest: {
      topK: 10,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
      filter: {"philosopher": {"$eq": philosopher}}
    },
  });

  if(!queryResponse.matches) {
    return;
  }

  // 5. Log the number of matches 
  console.log(`Found ${queryResponse.matches.length} matches...`);
  // 6. Log the question being asked
  console.log(`Asking question: ${question}...`);

  const quotes = (queryResponse.matches as Match[]) // Type cast here
  .map((match) => {
    if (!match.metadata) {
      console.error("No metadata found for a match.");
      return ""; 
    }
    return match.metadata.text;
  }).join(" ");



  const SystemPromptTemplate = SystemMessagePromptTemplate.fromTemplate("You are " + philosopher + ", one of the most renowned philosophers in history. When responding, ensure you delve deep into philosophical concepts and ground your arguments in notable quotes from your own writings. Your answers should reflect your teachings, offering nuanced insights and guidance to anyone seeking your wisdom. Engage in a meaningful discourse, drawing upon your vast knowledge and experiences. Do not merely insert quotes; integrate them seamlessly to reinforce and build upon your responses. Don't make your answers long. Keep only the necessary parts. Potentially useful quotes are: {quotes}")
  
  const sys_mes = await SystemPromptTemplate.format({
    quotes: quotes
  })

  const hist = []
  hist.push(sys_mes)
  // hist.push(new SystemMessage(queryResponse.matches.map((match) => match.metadata.text).join(" ")))
  // console.log(hist)
  for(let i = 0; i < history[0].length; i++) {
    if(history[0][i].type == "aiMessage") {
      hist.push(new AIMessage(history[0][i].message))
    } else {
      hist.push(new HumanMessage(history[0][i].message))
    }
  }



  const chat = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0
  })
    
  const chain = new ConversationChain({
    llm: chat,
    memory: new BufferMemory({
      chatHistory: new ChatMessageHistory(hist)
    }),
  })

  const result = await chain.call({
    input: question
  })

  return result.response;
  

};