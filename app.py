from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from func import load_model, image_to_text
import io


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor, model, device = load_model()

@app.get("/")
def home():
    return {"message": "Ink2Text API is running"}

@app.post("/recognize")
async def recognize(file: UploadFile = File(...)):
    print("Image reçue")
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    print("Début prédiction")
    text = image_to_text(image, processor, model, device)
    print("Texte prédit:", text)

    return {"text": text}