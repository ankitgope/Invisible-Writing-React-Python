# Steganography Website Backend

This document provides the API documentation for the Steganography Website backend project.

## API Endpoints

### 1. Encode Message

**Endpoint:** `/api/encode`

**Method:** `POST`

**Description:** Encodes a secret message into an image.

**Request Body:**

```json
{
  "image": "base64_encoded_image",
  "message": "secret_message"
}
```

**Response:**

```json
{
  "encoded_image": "base64_encoded_image_with_message"
}
```

### 2. Decode Message

**Endpoint:** `/api/decode`

**Method:** `POST`

**Description:** Decodes a secret message from an image.

**Request Body:**

```json
{
  "image": "base64_encoded_image"
}
```

**Response:**

```json
{
  "message": "decoded_secret_message"
}
```

### 3. Health Check

**Endpoint:** `/api/health`

**Method:** `GET`

**Description:** Checks the health status of the API.

**Response:**

```json
{
  "status": "healthy"
}
```

## Error Handling

### Common Error Responses

**400 Bad Request:**

- Invalid input data.

**500 Internal Server Error:**

- An unexpected error occurred on the server.

## Running the Project

To run the backend server, use the following command:

```bash
python app.py
```

Ensure you have all the required dependencies installed. You can install them using:

```bash
pip install -r requirements.txt
```

## Contact

For any questions or issues, please contact the project maintainer.
