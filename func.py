import requests
from PIL import Image
import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

def load_model():
    processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten") # processing image so the model can read it
    model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten") # loading model
    
    device = "cuda" if torch.cuda.is_available() else "cpu"

    model.to(device) # link model to the hardware
    return processor, model, device


def image_to_text(image: Image.Image, processor, model, device):
    image = image.convert("RGB")

    pixel_values = processor(images=image, return_tensors="pt").pixel_values.to(device) # transform image into a tensor and send it to choosen hardware
    
    with torch.no_grad():
        generated_ids = model.generate(pixel_values,  max_new_tokens=32) # generate token ids , no gradient computing
    
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0] # generate text from token ids
    return generated_text