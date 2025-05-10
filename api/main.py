from fastapi import FastAPI
import boto3
from dotenv import load_dotenv
import os

from image_processor import get_image_labels

# Load environment variables from .env file
load_dotenv()

client = boto3.client(
    "rekognition",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION", "us-west-2"),
)

app = FastAPI()


@app.get("/")
async def root():

    image_path = "IMG_1334.JPG"

    with open(image_path, "rb") as image_file:
        response = get_image_labels(image_file.read(), client)

    return response

