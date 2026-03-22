// app/api/chat/route.ts
import { ChatGroq } from "@langchain/groq";
import { MixedbreadAIEmbeddings } from "@langchain/mixedbread-ai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/document_loaders/fs/pdf";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastUserMessage = messages[messages.length - 1].content;

  // 1. Configurar Embeddings de Mixedbread
  const embeddings = new MixedbreadAIEmbeddings({
    apiKey: process.env.MXBAI_API_KEY, // Consíguela en mixedbread.ai
    model: "mxb_1w4L6qLVScAblxZkMDAKAxHyAZ8f",
  });

  // 2. Cargar tus 4 PDFs (Asumiendo que están en una carpeta /public/docs)
  const pdfPaths = [
    "public/docs/CartaDeAlimentacion.pdf",
    "public/docs/conceptosAlimentacion.pdf",
    "public/docs/Frank_Suarez_El_Poder_del_Metabolismo.pdf",
    "public/docs/NutricionDeportiva.pdf",
    "public/docs/TiposDeDieta.pdf",

  ];

  let allDocs = [];
  for (const path of pdfPaths) {
    const loader = new PDFLoader(path);
    const docs = await loader.load();
    
    // Dividir el texto en trozos para que quepan en el contexto
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const splitDocs = await splitter.splitDocuments(docs);
    allDocs.push(...splitDocs);
  }

  // 3. Crear el Vector Store temporal (en memoria)
  const vectorStore = await MemoryVectorStore.fromDocuments(allDocs, embeddings);
  
  // 4. Buscar los 3 fragmentos más relevantes
  const relevantContext = await vectorStore.similaritySearch(lastUserMessage, 3);
  const contextText = relevantContext.map(d => d.pageContent).join("\n\n");

  // 5. Groq responde con ese contexto
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    modelName: "llama-3.1-8b-instant",
  });

  const response = await model.invoke([
    ["system", `Eres un asistente experto. Responde basándote SOLO en este contexto extraído de los 4 PDFs:\n\n${contextText}`],
    ["human", lastUserMessage],
  ]);

  return Response.json({ role: "assistant", content: response.content });
}