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


export const queryPineconeVectorStoreAndQueryLLM = async (
  client,
  indexName,
  question,
  philosopher,
  history
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

  // 5. Log the number of matches 
  console.log(`Found ${queryResponse.matches.length} matches...`);
  // 6. Log the question being asked
  console.log(`Asking question: ${question}...`);

  const quotes = queryResponse.matches.map((match) => match.metadata.text).join(" ")


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
  // const chain = new LLMChain({
  //   llm: chat,
  //   memory: new BufferMemory({returnMessages: true, memoryKey: "history"}),
  //   prompt: chatPrompt, 
  // })

  // const result = await chain.call({
  //   quotes: queryResponse.matches.map((match) => match.response).join(" "),
  // })

//   console.log(result.text)

  return result.response;
  


//   if (queryResponse.matches.length) {
//     // 7. Create an OpenAI instance and load the QAStuffChain
//     const llm = new OpenAI({});
//     const chain = loadQAStuffChain(llm);
//     // 8. Extract and concatenate page content from matched documents
//     const concatenatedPageContent = queryResponse.matches
//       .map((match) => match.metadata.pageContent)
//       .join(" ");
//     // 9. Execute the chain with input documents and question
//     const result = await chain.call({
//       input_documents: [new Document({ pageContent: concatenatedPageContent })],
//       question: question,
//     });
//     // 10. Log the answer
//     console.log(`Answer: ${result.text}`);
    return queryResponse
//   } else {
//     // 11. Log that there are no matches, so GPT-3 will not be queried
//     console.log('Since there are no matches, GPT-3 will not be queried.');
//   }
};
// export const createPineconeIndex = async (
//   client,
//   indexName,
//   vectorDimension
// ) => {
//   // 1. Initiate index existence check
//   console.log(`Checking "${indexName}"...`);
//   // 2. Get list of existing indexes
//   const existingIndexes = await client.listIndexes();
//   // 3. If index doesn't exist, create it
//   if (!existingIndexes.includes(indexName)) {
//     // 4. Log index creation initiation
//     console.log(`Creating "${indexName}"...`);
//     // 5. Create index
//     await client.createIndex({
//       createRequest: {
//         name: indexName,
//         dimension: vectorDimension,
//         metric: 'cosine',
//       },
//     });
//     // 6. Log successful creation
//       console.log(`Creating index.... please wait for it to finish initializing.`);
//     // 7. Wait for index initialization
//     await new Promise((resolve) => setTimeout(resolve, timeout));
//   } else {
//     // 8. Log if index already exists
//     console.log(`"${indexName}" already exists.`);
//   }
// };


// export const updatePinecone = async (client, indexName, docs) => {
//   console.log('Retrieving Pinecone index...');
//   // 1. Retrieve Pinecone index
//   const index = client.Index(indexName);
//   // 2. Log the retrieved index name
//   console.log(`Pinecone index retrieved: ${indexName}`);
//   // 3. Process each document in the docs array
//   for (const doc of docs) {
//     console.log(`Processing document: ${doc.metadata.source}`);
//     const txtPath = doc.metadata.source;
//     const text = doc.pageContent;
//     // 4. Create RecursiveCharacterTextSplitter instance
//     const textSplitter = new RecursiveCharacterTextSplitter({
//       chunkSize: 1000,
//     });
//     console.log('Splitting text into chunks...');
//     // 5. Split text into chunks (documents)
//     const chunks = await textSplitter.createDocuments([text]);
//     console.log(`Text split into ${chunks.length} chunks`);
//     console.log(
//       `Calling OpenAI's Embedding endpoint documents with ${chunks.length} text chunks ...`
//     );
//     // 6. Create OpenAI embeddings for documents
//     const embeddingsArrays = await new OpenAIEmbeddings().embedDocuments(
//       chunks.map((chunk) => chunk.pageContent.replace(/\n/g, " "))
//     );
//     console.log('Finished embedding documents');
//     console.log(
//       `Creating ${chunks.length} vectors array with id, values, and metadata...`
//     );
//     // 7. Create and upsert vectors in batches of 100
//     const batchSize = 100;
//     let batch:any = [];
//     for (let idx = 0; idx < chunks.length; idx++) {
//       const chunk = chunks[idx];
//       const vector = {
//         id: `${txtPath}_${idx}`,
//         values: embeddingsArrays[idx],
//         metadata: {
//           ...chunk.metadata,
//           loc: JSON.stringify(chunk.metadata.loc),
//           pageContent: chunk.pageContent,
//           txtPath: txtPath,
//         },
//       };
//       batch = [...batch, vector]
//       // When batch is full or it's the last item, upsert the vectors
//       if (batch.length === batchSize || idx === chunks.length - 1) {
//         await index.upsert({
//           upsertRequest: {
//             vectors: batch,
//           },
//         });
//         // Empty the batch
//         batch = [];
//       }
//     }
//     // 8. Log the number of vectors updated
//     console.log(`Pinecone index updated with ${chunks.length} vectors`);
//   }
// };