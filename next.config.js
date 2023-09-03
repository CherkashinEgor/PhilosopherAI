/** @type {import('next').NextConfig} */
const nextConfig = {
    // async headers(){
    //     return [
    //         {
    //             source: "/api/:path*",
    //             headers: [
    //                 { key: "Access-Control-Allow-Credentials", value: "true" },
    //                 { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" }, // replace this your actual origin
    //                 { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
    //                 { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
    //             ]
    //         }
    //     ]
    // },
    env: {
        PINECONE_API: "5046afde-c382-4b70-b8be-41cc04c664b3",
        OPENAI_API_KEY: "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",
        PINECONE_ENV: "asia-southeast1-gcp"
    }
}

module.exports = nextConfig
