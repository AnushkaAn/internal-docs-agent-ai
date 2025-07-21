from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, Settings, StorageContext
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
import chromadb

def build_index():
    # Configure embeddings
    Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
    
    # Load documents
    documents = SimpleDirectoryReader("data").load_data()
    
    # Setup ChromaDB
    chroma_client = chromadb.Client()
    chroma_collection = chroma_client.create_collection("internal_docs")
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    
    # Build and save index
    index = VectorStoreIndex.from_documents(documents, vector_store=vector_store)
    index.storage_context.persist(persist_dir="index/storage")
    print("✅ Index built and saved successfully")

if __name__ == "__main__":
    build_index()