# FastAPI Hello World

A simple FastAPI application that returns a "Hello World" message.

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Setup

1. Clone this repository or download the files

2. Create a virtual environment (recommended):

```bash
python -m venv venv
```

3. Activate the virtual environment:

- On Windows:

```bash
venv\Scripts\activate
```

- On macOS/Linux:

```bash
source venv/bin/activate
```

4. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Running the Application

Start the server with:

```bash
uvicorn main:app --reload --port 8080
```

The application will be available at `http://localhost:8080`

Note: If you encounter a socket permission error, try using a different port by changing the `--port` number (e.g., 8080, 3000, 5000).

## API Endpoints

- `GET /`: Returns a "Hello World" message
  - Response: `{"message": "Hello World"}`

## API Documentation

FastAPI automatically generates interactive API documentation:

- Swagger UI: `http://localhost:8080/docs`
- ReDoc: `http://localhost:8080/redoc`
