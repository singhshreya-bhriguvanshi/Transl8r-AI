# Use Python 3.11 slim image (you can use 3.10 if you prefer)
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy all files into the container
COPY . /app

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r backend/models/requirements.txt

# Expose the port (Render will set $PORT)
EXPOSE 10000

# Start the FastAPI app
CMD ["uvicorn", "backend.models.model_server:app", "--host", "0.0.0.0", "--port", "10000"]
