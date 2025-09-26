
import { ImageFile } from "../types";

export const editImageWithPrompt = async (base64ImageData: string, mimeType: string, textPrompt: string): Promise<ImageFile | null> => {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set. Please add it to your .env.local file.");
  }

  const model = 'gemini-2.5-flash-image-preview';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

  // The REST API expects snake_case for request bodies.
  // The SDK for this preview model requires 'responseModalities'. We map it to the REST equivalent.
  const requestBody = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64ImageData,
            },
          },
          {
            text: textPrompt,
          },
        ],
      },
    ],
    // For the image editing model, specifying response modalities is crucial,
    // even though it's not in the standard REST API documentation.
    generation_config: {
        "response_modalities": ["IMAGE", "TEXT"]
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
      }
      console.error("API Error Response:", errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // The response body contains candidates with camelCase keys
    if (data.candidates && data.candidates.length > 0) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return {
            base64: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
            name: 'edited-image.png'
          };
        }
      }
    }
    
    return null; // No image part found

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không mong muốn.';
    throw new Error(`Không thể kết nối với mô hình AI. Vui lòng kiểm tra prompt của bạn hoặc thử lại sau. (${errorMessage})`);
  }
};
