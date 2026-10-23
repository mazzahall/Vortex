FROM python:3.10-slim

# Install ffmpeg untuk ekstraksi audio MP3
RUN apt-get update && apt-get install -y ffmpeg git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements dan install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Jalankan server menggunakan Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "api.app:app", "--timeout", "120"]