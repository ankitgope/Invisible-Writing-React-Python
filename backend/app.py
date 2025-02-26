# working backend 

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import io

app = Flask(__name__)
CORS(app)

# XOR Encryption for Simple Security
def xor_encrypt_decrypt(text, password):
    return ''.join(chr(ord(t) ^ ord(password[i % len(password)])) for i, t in enumerate(text))

@app.route("/encode", methods=["POST"])
def encode():
    if "image" not in request.files or "message" not in request.form or "password" not in request.form:
        return jsonify({"error": "Missing required fields"}), 400

    image = request.files["image"]
    msg = request.form["message"]
    password = request.form["password"]

    # Encrypt the message
    encrypted_msg = xor_encrypt_decrypt(msg, password)
    encrypted_bytes = encrypted_msg.encode("utf-8")  # Store message in UTF-8 format

    file_bytes = np.frombuffer(image.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    h, w, _ = img.shape
    length = len(encrypted_bytes)

    if length > (h * w * 3) - 2:
        return jsonify({"error": "Message too long for image"}), 400

    # Store message length in first two pixels
    img[0, 0, 0] = (length >> 8) & 0xFF  # High byte
    img[0, 0, 1] = length & 0xFF         # Low byte

    # Encode message
    index = 0
    for i in range(h):
        for j in range(w):
            for z in range(3):
                if i == 0 and j == 0 and z < 2:
                    continue  # Skip first two pixels storing the length
                if index < length:
                    img[i, j, z] = encrypted_bytes[index]
                    index += 1

    # Convert encoded image to bytes
    _, buffer = cv2.imencode(".png", img)
    img_io = io.BytesIO(buffer)

    return send_file(img_io, mimetype="image/png", as_attachment=True, download_name="encoded_image.png")

@app.route("/decode", methods=["POST"])
def decode():
    if "image" not in request.files or "password" not in request.form:
        return jsonify({"error": "Missing required fields"}), 400

    image = request.files["image"]
    input_password = request.form["password"]

    file_bytes = np.frombuffer(image.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    h, w, _ = img.shape

    # Retrieve message length from first two pixels
    length = (img[0, 0, 0] << 8) | img[0, 0, 1]

    message_bytes = bytearray()
    index = 0

    for i in range(h):
        for j in range(w):
            for z in range(3):
                if i == 0 and j == 0 and z < 2:
                    continue  # Skip first two pixels
                if index < length:
                    message_bytes.append(img[i, j, z])
                    index += 1

    # Decode message
    decrypted_msg = xor_encrypt_decrypt(message_bytes.decode("utf-8"), input_password)

    return jsonify({"message": decrypted_msg})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
# 2