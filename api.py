from fastapi import FastAPI, File, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, StorageContext
from app.qa_engine import get_answer
import os

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "docs"
INDEX_DIR = "index/storage"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(INDEX_DIR, exist_ok=True)


@app.get("/")
def read_root():
    return {"message": "Backend is up!"}


@app.post("/upload")
async def upload_file(files: list[UploadFile] = File(...)):
    # Clear old files in the docs folder
    for existing_file in os.listdir(UPLOAD_DIR):
        os.remove(os.path.join(UPLOAD_DIR, existing_file))

    # Save new uploaded files
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())

    # Rebuild and persist new index
    documents = SimpleDirectoryReader(UPLOAD_DIR).load_data()
    index = VectorStoreIndex.from_documents(documents)
    index.storage_context.persist(persist_dir=INDEX_DIR)

    return {"message": "Files uploaded and index built successfully"}



@app.post("/query")
async def query_docs(request: Request):
    data = await request.json()
    question = data.get("question", "")
    answer = get_answer(question)
    return {"answer": answer}


@app.get("/files")
def list_files():
    files = os.listdir(UPLOAD_DIR)
    return {"files": files}
