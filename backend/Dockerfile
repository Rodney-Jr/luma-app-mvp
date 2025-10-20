FROM python:3.10-slim

WORKDIR /app
ENV PYTHONUNBUFFERED=1

COPY backend/app ./app
COPY backend/requirements.txt ./requirements.txt

RUN apt-get update && apt-get install -y build-essential \
  && pip install --no-cache-dir -r requirements.txt \
  && apt-get remove -y build-essential && apt-get autoremove -y

EXPOSE 8000
ENV LUMA_DB_PATH=/data/luma.sqlite3
VOLUME ["/data"]

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
