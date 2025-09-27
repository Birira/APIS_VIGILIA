

FROM python:3.11-slim

COPY . /app

WORKDIR /app
RUN pip install -r requirements.txt
ENTRYPOINT ["uvicorn", "--host", "127.0.0.1", "urls:app", "--port", "8000", "--reload"]
