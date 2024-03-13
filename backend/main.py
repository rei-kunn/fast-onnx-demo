from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import onnxruntime as ort
import numpy as np
import time
import csv
import re

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModelName(BaseModel):
    modelName: str

def read_model_info(csv_path):
    model_info = {}
    with open(csv_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            model_info[int(row['idx'])] = row
    return model_info

model_info = read_model_info('result_100.csv')

def get_model_idx(model_name):
    match = re.search(r'\d+', model_name)
    if match:
        return int(match.group())
    return None

async def load_and_inder_model(model_path, input_data):
    start_time = time.time()
    session = ort.InferenceSession(model_path)
    input_name = session.get_inputs()[0].name
    result = session.run(None, {input_name: input_data})
    loading_time = time.time() - start_time
    return "Success" , loading_time

@app.post("/load-model/")
async def load_model(model_name: ModelName):
    model_path = f"models/{model_name.modelName}"
    input_data = np.random.randn(1, 3, 640, 640).astype(np.float32)
    result, loading_time = await load_and_inder_model(model_path, input_data)

    model_idx = get_model_idx(model_name.modelName)
    if model_idx is not None and model_idx in model_info:
        additional_info = model_info[model_idx]
    else:
        additional_info = " model info cannot be found."

    return {"result": result, "loadingTime": loading_time, "additionalInfo": additional_info}