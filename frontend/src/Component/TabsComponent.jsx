import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useRef, useState } from "react";

export default function SteganographyApp() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    resresetAllStates()
  };

  // Encode States
  const [textMessage, setTextMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [encodedImage, setEncodedImage] = useState(null);

  // Decode States
  const [decodedMessage, setDecodedMessage] = useState("");
  const [decodeImageFile, setDecodeImageFile] = useState(null);
  const [previewDecodeImage, setPreviewDecodeImage] = useState(null);

  // Password States
  const [password, setPassword] = useState("");
  const [decodePassword, setDecodePassword] = useState("");

  // Refs for input file
  const fileInputRef = useRef(null);
  const decodeFileInputRef = useRef(null);

  // Reset all states
  const resresetAllStates = () => {
   setTextMessage("");
   setImageFile(null);
   setPreviewImage(null);
   setEncodedImage(null);
   setDecodedMessage("");
   setDecodeImageFile(null);
   setPreviewDecodeImage(null);
   setPassword("");
   setDecodePassword("");
  }

  // if (fileInputRef.current) fileInputRef.current.value = null;
  // if (decodeFileInputRef.current) decodeFileInputRef.current.value = null;

  // Handle Image Upload (Encoding)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle Image Upload (Decoding)
  const handleDecodeImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDecodeImageFile(file);
      setPreviewDecodeImage(URL.createObjectURL(file));
    }
  };

  // Remove Image (Encoding)
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    fileInputRef.current.value = null;
  };

  

  // Handle Encode API Call
  const handleEncode = async () => {
    if (!imageFile || !textMessage || !password) {
      alert("Please select an image, enter a message, and set a password.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("message", textMessage);
    formData.append("password", password);

    try {
      const response = await fetch("http://127.0.0.1:5000/encode", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to encode image");
      }

      // Convert response to Blob
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      setEncodedImage(imageUrl); // Store URL in state
    } catch (error) {
      console.error("Error encoding image:", error);
      alert("Encoding failed. Please try again.");
    }
  };

  // Handle Decode API Call
  const handleDecode = async () => {
    if (!decodeImageFile || !decodePassword) {
      alert("Please select an image and enter the password.");
      return;
    }

    const formData = new FormData();
    formData.append("image", decodeImageFile);
    formData.append("password", decodePassword);

    try {
      const response = await fetch("http://127.0.0.1:5000/decode", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to decode image");
      }

      const result = await response.json();
      setDecodedMessage(result.message);
    } catch (error) {
      console.error("Error decoding image:", error);
      alert("Decoding failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto max-w-screen-md p-6 bg-white shadow-lg rounded-xl">
      <Box sx={{ width: "100%" }}>
        <Tabs
          onChange={handleChange}
          value={value}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Encode and Decode Tabs"
          className="border-b border-gray-300"
        >
          <Tab label="Encode" className="font-semibold text-gray-700" />
          <Tab label="Decode" className="font-semibold text-gray-700" />
        </Tabs>

        {/* ENCODE SECTION */}
        {value === 0 && (
          <div className="bg-blue-50 text-gray-900 flex flex-col p-6 rounded-lg mt-4">
            <h1 className="text-2xl font-bold mb-4">Encode Message</h1>

            <input
              type="text"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              placeholder="Enter your message here"
              className="border p-3 mt-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="border p-3 mt-4 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="mt-4 p-2 border rounded-md w-full bg-gray-50"
            />

            <button
              onClick={handleEncode}
              className="mt-4 bg-blue-600 text-white px-6 py-3 text-lg rounded-md hover:bg-blue-700 transition"
            >
              Encode
            </button>

            {previewImage && (
              <div className="relative mt-6 bg-white p-4 rounded-lg shadow-md">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full max-w-xs mx-auto h-auto rounded-md"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition"
                >
                  ✖
                </button>
              </div>
            )}

            {encodedImage && (
              <div className="mt-6 bg-white p-4 rounded-lg shadow-md text-center">
                <h2 className="text-xl font-semibold mb-2">Encoded Image</h2>
                <img
                  src={encodedImage}
                  alt="Encoded"
                  className="w-full max-w-xs mx-auto h-auto rounded-md"
                />

                <a
                  href={encodedImage}
                  download="encoded_image.png"
                  className="mt-4 inline-block bg-black text-black px-6 py-3 text-lg rounded-md hover:bg-green-700 transition"
                >
                  Download Image
                </a>
              </div>
            )}
          </div>
        )}

        {/* DECODE SECTION */}
        {value == 1 && (
           <div className="bg-green-50 text-gray-900 flex flex-col p-6 rounded-lg mt-4">
           <h1 className="text-2xl font-bold mb-4">Decode Message</h1>

           <input
             type="password"
             value={decodePassword}
             onChange={(e) => setDecodePassword(e.target.value)}
             placeholder="Enter password"
             className="border p-3 mt-4 rounded-md w-full"
           />

           <input
             type="file"
             accept="image/*"
             onChange={handleDecodeImageChange}
             ref={decodeFileInputRef}
             className="mt-4 p-2 border rounded-md w-full bg-gray-50"
           />

           {/* Image Preview Section for Decoding */}
           {previewDecodeImage && (
             <div className="mt-4 text-center">
               <h2 className="text-xl font-semibold mb-2">Selected Image</h2>
               <img
                 src={previewDecodeImage}
                 alt="Selected for decoding"
                 className="w-full max-w-xs mx-auto h-auto rounded-md shadow-lg"
               />
             </div>
           )}

           <button
              onClick={handleDecode}
             className="mt-4 bg-green-600 text-white px-6 py-3 text-lg rounded-md hover:bg-green-700 transition"
           >
             Decode
           </button>

           {/* Decoded Message Display */}
           {decodedMessage && (
             <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
               <h2 className="text-xl font-semibold">Decoded Message:</h2>
               <p className="mt-2 text-lg text-gray-800">{decodedMessage}</p>
             </div>
           )}
         </div>
        )}
      </Box>
    </div>
  );
}
