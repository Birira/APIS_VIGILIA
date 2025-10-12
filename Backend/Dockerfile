

FROM python:3.11-slim

COPY . /app

WORKDIR /app
RUN pip install -r requirements.txt
ENTRYPOINT ["uvicorn", "--host", "0.0.0.0", "main:app", "--port", "8000"]
