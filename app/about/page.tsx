import Head from 'next/head';

export default function About() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-10 px-4 lg:px-0 bg-gradient-to-br from-stone-50 via-indigo-100 to-emerald-200">
        <Head>
            <title>About - Philosopher AI</title>
        </Head>

        <div className="space-y-6 w-full max-w-5xl mb-12 mt-16">
            <h1 className="text-6xl font-bold text-center text-emerald-900">About the Project</h1>
        </div>

        <div className="mt-8 p-6 w-full max-w-7xl bg-mantis-900 shadow-lg rounded-lg space-y-6 text-stone-700">
            {/* Project Basis */}
            <section className="space-y-4">
                <h2 className="text-3xl font-bold">Project Basis</h2>
                <p>I recently read through Meditations by Marcus Aurelius and found there to be a tremendous amount of wisdom contained within it that is often hard to fully grasp and recall on demand. This sparked the idea for a project where I could apply the teachings of different philosophers to modern issues, leveraging the capabilities of large language models. My goal was to build an AI assistant that could provide personalized advice using timeless philosophical principles.</p>
            </section>

            {/* Technical Info */}
            <section className="space-y-4 mt-6">
                <h2 className="text-3xl font-bold">Technical Info</h2>
                <p>To bring this idea to life, I first collected full works from a couple influential philosophers. For now only Marcus Aurelius and Rene Descartes are added to the database. I split these corpus into smaller excerpts to make them more digestible.</p>
                <p>These excerpts were then embedded into a Pinecone vector store using OpenAI Embeddings function. Pinecone allowed me to index and query the passages efficiently.</p>
                <p>By leveraging the LangChain library, I was able to connect these passages to a GPT language model in an intelligent way. LangChain issues queries to the vector store based on user input, retrieves relevant quotes, and passes them to GPT to generate a response.</p>
                <p>This approach reduced the risk of GPT hallucinating or fabricating content, since the responses are grounded in genuine quotes from philosophical texts.</p>
            </section>

            {/* Tech Stack */}
            <section className="space-y-4 mt-6">
                <h2 className="text-3xl font-bold">Tech Stack</h2>
                <ul className="list-disc pl-6">
                    <li>ReactJS - Frontend framework for building user interfaces</li>
                    <li>Next.js - React framework for server-side rendering and tooling</li>
                    <li>LangChain - Library for chaining NLP models and vector stores</li>
                    <li>OpenAI API - Large language model (GPT-3) for text generation</li>
                    <li>Pinecone - Vector database for storing and querying text embeddings</li>
                </ul>
            </section>
        </div>
    </div>
  )
}
