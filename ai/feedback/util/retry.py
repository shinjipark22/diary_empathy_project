def retry_call(fn, retries: int):
    last_err = None
    for _ in range(retries):
        try:
            return fn()
        except Exception as e:
            last_err = e 
    raise last_err 