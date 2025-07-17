FROM python:3.11

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose the port Render will use
EXPOSE 8000

# Start the app
CMD ["uvicorn", "fetchOptionData:app", "--host", "0.0.0.0", "--port", "8000"]