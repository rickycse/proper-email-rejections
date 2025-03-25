import datetime
from flask import Flask, request
import os
import cohere
import json
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from pymongo import MongoClient
from app_secrets import EXTENSION_ID, MONGO_URI, MODEL_NAME, DATABASE_NAME, COLLECTION_NAME, COHERE_API_KEY, PROMPT_1, PROMPT_2, PROMPT_3

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origin": EXTENSION_ID,
        "methods": ["POST"],
        "allowedHeaders": ["Content-Type"],
    },
})

mongo_client = MongoClient(MONGO_URI)
co = cohere.ClientV2(COHERE_API_KEY)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["5 per hour"] 
)

@app.route("/upload-submission", methods=["POST"])
@limiter.limit("1 per hour")
def upload_submission():
    data = request.get_json()
    email = data.get("submissionText", "")
    
    if len(email) == 0:
        return "Please provide an email", 400
    
    try:
        db = mongo_client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]
        
        data = {
            "text": email,
            "timestamp": datetime.datetime.now(),
        }
        collection.insert_one(data)

        return "Submission uploaded successfully", 200
    except Exception as e:
        return {"error": str(e)}, 500

@app.route("/generate-message", methods=["POST"])
def generate_message():
    data = request.get_json()
    text = data.get("text", "")
    
    if len(text) == 0:
        return "Please provide a message", 400

    if len(PROMPT_1) == 0 or len(PROMPT_2) == 0 or len(PROMPT_3) == 0:
        return "Failed to fetch prompts from secrets, please try again later.", 500

    try:
        response = co.chat(
            model=MODEL_NAME, 
            messages=[
                {
                    "role": "user",
                    "content": text,
                },
                {
                    "role": "user",
                    "content": PROMPT_1,
                },
                {
                    "role": "user",
                    "content": PROMPT_2,
                },
                {
                    "role": "user",
                    "content": PROMPT_3
                },
            ]
        )
        response = json.loads(response.json())
        content = response.get("message", {}).get("content", "No content found")
        return content, 200
    except Exception as e:
        return f"Failed to fetch message due to: {e}", 500

PORT = int(os.getenv("PORT", 8080))
if __name__ == "__main__":
    app.run(host="localhost", port=PORT)