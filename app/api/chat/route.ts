import { NextRequest, NextResponse } from 'next/server'
import { PineconeClient } from '@pinecone-database/pinecone'
import {
  queryPineconeVectorStoreAndQueryLLM,
} from '../../../utils'
// import { indexName } from '../../../config'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const client = new PineconeClient()
  await client.init({
    apiKey: process.env.PINECONE_API || '',
    environment: process.env.PINECONE_ENV || ''
  })
  

  
  const text = await queryPineconeVectorStoreAndQueryLLM(client, "philosopher-ai", body['question'], body['philosopher'], body['history'])
  
  return NextResponse.json({
    data: text
  })
}