STANDARD_EMOTIONS = ["기쁨", "슬픔", "분노", "불안", "놀람", "중립"]

LABEL_MAP = {
    "외로움": "슬픔",
    "우울": "슬픔",
    "허탈함": "슬픔",
    "답답함": "불안",
    "긴장": "불안",
    "짜증": "분노",
    "행복": "기쁨",
    "안도감": "기쁨",
}

def normalize_emotions(llm_emotions):
    result = {k: 0.0 for k in STANDARD_EMOTIONS}

    for e in llm_emotions:
        raw = e["label"]
        intensity = e["intensity"]

        std = LABEL_MAP.get(raw, raw)

        if std in result:
            result[std] += intensity

    return result