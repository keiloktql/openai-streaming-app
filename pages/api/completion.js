import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export default async function POST(req) {
  const { prompt } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    stream: true,
    temperature: 0.1,
    prompt: `
    Give a fun-fact related to environmental conservation, related to the given product.
    XXX refers to an estimated quantitative value of CO2 emissions.
    Give an answer no matter what, you must give a rough estimate of the value of CO2 produced based on all information provided.
    Or else, provide the error response.

    Information:
    Product title: ${prompt}
    `,
    max_tokens: 100
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
