from llama_index.core import VectorStoreIndex, StorageContext, load_index_from_storage, Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from transformers import pipeline

Settings.llm = None
Settings.embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/paraphrase-MiniLM-L3-v2")

# Initialize components
_qa_pipeline = None
_index = None

def get_answer(query: str) -> str:
    global _qa_pipeline, _index

    try:
        # Lazy load index
        if _index is None:
            storage_context = StorageContext.from_defaults(persist_dir="index/storage")
            _index = load_index_from_storage(storage_context)

        # Lazy load pipeline
        if _qa_pipeline is None:
            _qa_pipeline = pipeline(
                "text-generation",
                model="distilgpt2",
                device="cpu",
                max_length=200
            )

        # Retrieve context
        query_engine = _index.as_query_engine()
        context = query_engine.query(query)

        # Generate answer
        prompt = f"Context: {context}\nQuestion: {query}\nAnswer:"
        response = _qa_pipeline(prompt, max_new_tokens=100)[0]['generated_text']
        return response.split("Answer:")[-1].strip() or "Sorry, I couldn't find a good answer."

    except Exception as e:
        print(f"Error: {e}")
        return "Something went wrong. Please try again."
