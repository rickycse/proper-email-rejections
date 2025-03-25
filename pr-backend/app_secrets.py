import dotenv
import os

dotenv.load_dotenv()

EXTENSION_ID = os.getenv("EXTENSION_ID", None)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
MODEL_NAME = os.getenv("MODEL_NAME", "")
DATABASE_NAME = os.getenv("DATABASE_NAME", "")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "")

COHERE_API_KEY = os.getenv("COHERE_API_KEY", "")
PROMPT_1 = os.getenv("PROMPT_1", "")
PROMPT_2 = os.getenv("PROMPT_2", "")
PROMPT_3 = os.getenv("PROMPT_3", "")