# Stage 1: Build Stage
FROM python:3.9-slim-buster AS builder

WORKDIR /app

# Install system dependencies needed for yfinance (e.g., if it relies on C extensions)
# While yfinance itself is pure Python, pandas often benefits from numpy which might.
# For many common Python packages, slim-buster is usually enough.
# If you encounter issues later about missing libraries (like build tools),
# you might need to add packages like build-essential, libffi-dev, etc.
# For now, let's keep it minimal.

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final Image Stage
FROM python:3.9-slim-buster

WORKDIR /app

# Expose the port that Uvicorn will run on
EXPOSE 8000

# Copy the installed dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Copy your application code
# Assuming your FastAPI app is in a file named 'fetchOptionData.py'
COPY fetchOptionData.py .

# Command to run the FastAPI application using Uvicorn
# 'fetchOptionData' is the Python module name (fetchOptionData.py)
# 'app' is the FastAPI instance within that module
# '--host 0.0.0.0' makes the server accessible from outside the container
# '--port 8000' is the port Uvicorn will listen on
CMD ["uvicorn", "fetchOptionData:app", "--host", "0.0.0.0", "--port", "8000"]