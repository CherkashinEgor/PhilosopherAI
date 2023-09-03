import { IndexMeta, PineconeClient } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

export async function POST() {
  const client = new PineconeClient();
  if (!process.env.PINECONE_API) {
      throw new Error("PINECONE_API_KEY environment variable not set");
    }
    if (!process.env.PINECONE_ENV) {
      throw new Error("PINECONE_ENVIRONMENT environment variable not set");
    }
  await client.init({
    apiKey: process.env.PINECONE_API,
    environment: process.env.PINECONE_ENV
  });

  try {
    await client.Index("philosopher-ai")
  } catch (e) {
    console.log("Error: ", e);
  }

  return NextResponse.json({
    data: "success"
  })
}

// export const waitUntilIndexIsReady = async (client: PineconeClient, indexName: string) => {
//     try {
//       const indexDescription: IndexMeta = await client.describeIndex({ indexName })
      
//       if (!indexDescription.status?.ready) {
//         await new Promise((r) => setTimeout(r, 1000));
//         await waitUntilIndexIsReady(client, indexName)
//       }
//       else {
//         return
//       }
//     } catch (e) {
//       console.error('Error waiting until index is ready', e)
//     }
//   }
  
//   let pineconeClient: PineconeClient | null = null
//   export const getPineconeClient: () => Promise<PineconeClient> = async () => {
//     console.log(process.env.PINECONE_API)
//     if (!process.env.PINECONE_API) {
//       throw new Error("PINECONE_API_KEY environment variable not set");
//     }
//     if (!process.env.PINECONE_ENV) {
//       throw new Error("PINECONE_ENVIRONMENT environment variable not set");
//     }
  
//     // if (!process.env.PINECONE_INDEX) {
//     //   throw new Error("PINECONE_INDEX environment variable not set");
//     // }
  
//     if (pineconeClient) {
//       return pineconeClient
//     } else {
//       pineconeClient = new PineconeClient();
  
//       await pineconeClient.init({
//         apiKey: process.env.PINECONE_API,
//         environment: process.env.PINECONE_ENV,
//       });
//     }
//     return pineconeClient
//   }