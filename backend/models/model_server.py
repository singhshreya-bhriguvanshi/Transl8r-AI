from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from transformers import MarianMTModel, MarianTokenizer
import torch
import tempfile
from fastapi.responses import FileResponse
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Language Translation API", version="1.0.0")

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# List your supported language pairs and their model directories here
MODEL_PAIRS = os.getenv("MODEL_PAIRS", "en-fr").split(",")
MODEL_BASE_PATH = os.getenv("MODEL_BASE_PATH", os.path.dirname(__file__))

MODEL_PATHS = {}
for pair in MODEL_PAIRS:
    MODEL_PATHS[pair] = pair

# Load all models and tokenizers at startup
MODELS = {}
for lang_pair, path in MODEL_PATHS.items():
    # Always resolve to absolute path
    model_dir = os.path.abspath(os.path.join(MODEL_BASE_PATH, path))
    print(f"Loading model for {lang_pair} from {model_dir} ...")
    try:
        MODELS[lang_pair] = {
            "tokenizer": MarianTokenizer.from_pretrained(model_dir, local_files_only=True),
            "model": MarianMTModel.from_pretrained(model_dir, local_files_only=True)
        }
        print(f"✅ Successfully loaded model for {lang_pair}")
    except Exception as e:
        print(f"❌ Failed to load model for {lang_pair}: {str(e)}")
        continue
print(f"All models loaded. Available pairs: {list(MODELS.keys())}")

class TranslationRequest(BaseModel):
    text: str

@app.post("/translate/{lang_pair}")
def translate(lang_pair: str, req: TranslationRequest):
    if lang_pair not in MODELS:
        return {"error": f"Language pair '{lang_pair}' not supported. Available pairs: {list(MODELS.keys())}"}
    
    try:
        tokenizer = MODELS[lang_pair]["tokenizer"]
        model = MODELS[lang_pair]["model"]
        
        # Get max length from environment
        max_length = int(os.getenv("MAX_TEXT_LENGTH", "512"))
        
        inputs = tokenizer([req.text], return_tensors="pt", padding=True, truncation=True, max_length=max_length)
        with torch.no_grad():
            translated = model.generate(**inputs)
        tgt_text = tokenizer.batch_decode(translated, skip_special_tokens=True)[0]
        return {"translation": tgt_text}
    except Exception as e:
        return {"error": f"Translation failed: {str(e)}"}

@app.post("/translate-file/{lang_pair}")
async def translate_file(lang_pair: str, file: UploadFile = File(...)):
    if lang_pair not in MODELS:
        return {"error": f"Language pair '{lang_pair}' not supported. Available pairs: {list(MODELS.keys())}"}
    
    try:
        tokenizer = MODELS[lang_pair]["tokenizer"]
        model = MODELS[lang_pair]["model"]
        
        # Get max length from environment
        max_length = int(os.getenv("MAX_TEXT_LENGTH", "512"))
        max_file_size = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB default
        
        # Check file size
        content = await file.read()
        if len(content) > max_file_size:
            return {"error": f"File too large. Maximum size: {max_file_size // 1024 // 1024}MB"}
        
        content_text = content.decode("utf-8")
        
        # For large files, you may want to split into chunks
        inputs = tokenizer([content_text], return_tensors="pt", padding=True, truncation=True, max_length=max_length)
        with torch.no_grad():
            translated = model.generate(**inputs)
        tgt_text = tokenizer.batch_decode(translated, skip_special_tokens=True)[0]
        
        # Return as a downloadable file
        temp_dir = os.getenv("TEMP_DIR", "/tmp")
        with tempfile.NamedTemporaryFile(delete=False, mode='w+', encoding='utf-8', suffix='.txt', dir=temp_dir) as tmp:
            tmp.write(tgt_text)
            tmp.flush()
            return FileResponse(tmp.name, filename=f"translated_{file.filename}")
    except Exception as e:
        return {"error": f"File translation failed: {str(e)}"}
