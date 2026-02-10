import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

MODEL_NAME = "gpt-5.2"
MODEL_ALIAS = "diary-empathy-ko"
MODEL_VERSION = "1.0.0"

TEMPERATURE = 0.4
MAX_RETRY = 2