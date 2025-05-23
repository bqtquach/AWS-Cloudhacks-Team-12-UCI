from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
import boto3
from dotenv import load_dotenv
import json
import os

from image_processor import get_image_labels
from llm import query_claude

# Load environment variables from .env file
load_dotenv()

# Initialize AWS clients
rekognition = boto3.client(
    "rekognition",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION", "us-west-2")
)

bedrock = boto3.client(
    "bedrock-runtime",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION", "us-west-2")
)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
async def root():

    image_path = "IMG_1334.JPG"

    with open(image_path, "rb") as image_file:
        response = get_image_labels(image_file.read(), rekognition)

    return response


@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):

    contents = await file.read()
    image_analysis = get_image_labels(contents, rekognition)

    print(image_analysis)

    response = query_claude(json.dumps(image_analysis), bedrock)

    return response


@app.get("/image1/{image}")     #One Image
async def sendone(image: "png"):
    url = "" + image        #URL for AI Call

    response = requests.get(url)    #AWS Calls

    s3 = boto3.client('s3')

    try:
        with open('/path/to/local/file.txt', 'rb') as f:
            s3.upload_fileobj(f, 'aws-hackathon-user-data-12', 'user' + hash(image))
        print('File uploaded successfully')
    except Exception as e:
        print('Error uploading file:', e)


    if response.status_code == 200: 
            return response.json() #No error received
    else:
            #Error received/handling
            print('Error:', response.status_code)
            return {"Error1":"Error2"}
    


@app.get("/image2/{image1}+{image2}") #Two Images
async def sendone(image1: "png", image2: "png"):
    image1_url = "" + image1    #URLs for AI Calls
    image2_url = "" + image2 

    response1 = requests.get(image1_url)   #AWS Calls
    response2 = requests.get(image2_url)


    s3 = boto3.client('s3')

    try:
        f1 = open(image1)
        s3.upload_fileobj(f1, 'aws-hackathon-user-data-12', 'user' + hash(image2))
        f2 = open(image2)
        s3.upload_fileobj(f2, 'aws-hackathon-user-data-12', 'user' + hash(image1))
        print('File uploaded successfully')
    except Exception as e:
        print('Error uploading file:', e)


    if response1.status_code == 200 and response2.status_code == 200:
          return {"image1_score": response1.json(), "image2_score": response2.json()}
  


handler = Mangum(app)