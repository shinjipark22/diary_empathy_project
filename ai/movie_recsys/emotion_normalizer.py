def normalize_emotions(llm_emotions):

    mapping = {
        # 슬픔 계열
        "슬픔": "슬픔",
        "우울": "슬픔",
        "외로움": "슬픔",
        "상실": "슬픔",

        # 기쁨 계열
        "기쁨": "기쁨",
        "행복": "기쁨",
        "즐거움": "기쁨",
        "설렘": "기쁨",

        # 불안 계열
        "불안": "불안",
        "걱정": "불안",
        "긴장": "불안",
        "두려움": "불안",

        # 분노 계열
        "분노": "분노",
        "화남": "분노",
        "짜증": "분노"
    }

    vector = {}

    for item in llm_emotions:
        label = item["label"]
        intensity = item["intensity"]

        base = mapping.get(label)
        if base:
            vector[base] = vector.get(base, 0) + intensity

    return vector