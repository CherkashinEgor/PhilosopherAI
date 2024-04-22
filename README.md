# Philosopher AI 📜

Welcome to the Philosopher AI project! I dived into this mainly to experiment with large language models (LLMs) and vector embeddings. I thought it would be interesting to see what advice LLMs would provide when prompted to act as ancient philosophers and given relevant quotes.

I started by gathering works from various philosophers, segmented them, and embedded the segments into Pinecone. To connect everything, I utilized LangChain to link a GPT model with the vector store, ensuring precise philosophical quotes without the GPT's usual hallucinations.


**Tech Stack**: 
- React.js
- Next.js
- LangChain
- OpenAI
- Pinecone
