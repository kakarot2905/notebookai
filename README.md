# 📓 Notebook AI
This project is deployed [here](https://notebook-ai-cp.vercel.app/)
- Frontend on Vercel
- Backend on Render
  
You may experience some delay in reponse since its deployed in free tier plans, please wait for 1-2 mins at inital usage.

## 📌 About
Notebook AI is an intelligent note-taking application that extracts and cleans handwritten text using Google Vision and OpenAI models.

## 🚀 Features
- 📝 **Handwritten Text Recognition** (Google Vision API)
- ✨ **AI-powered Text Cleaning** (OpenAI GPT-3.5 Turbo)
- 📁 **Save and Retrieve Notes** (MongoDB)
- 🔒 **Secure and Fast API** (Flask & Express.js)

## 📦 Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/EDAI-13/Notebook-AI.git
cd Notebook-AI
```

### 2️⃣ Install Dependencies
```sh
cmd /c setup.bat
```

### 3️⃣ Run the Project
```sh
cmd /c start.bat
```

## 🛠 Environment Variables
Create a `.env` file in the root directory and add the following:
```
MONGO_URI=your_mongodb_uri
PORT=5000
GOOGLE_API_KEY=your_google_vision_api_key
OPENAI_API_KEY=your_openai_api_key
```

## 📡 API Endpoints

### ➤ Upload an Image
**Endpoint:** `POST /upload`
- Uploads an image for text extraction and cleaning.
- **Request:** Form-data with an `image` file.
- **Response:** JSON with `extracted_text` and `cleaned_text`.

### ➤ Save a Note
**Endpoint:** `POST /save_note`
- Stores a note in the database.
- **Request:** JSON `{ "note": "Your Note Here" }`
- **Response:** Success message.

### ➤ Retrieve Notes
**Endpoint:** `GET /get_notes`
- Fetches all saved notes from the database.
- **Response:** JSON list of notes.

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request.

## 📄 License
This project is licensed under the **ISC License**.

## 📬 Contact
For questions, reach out via [GitHub Issues](https://github.com/EDAI-13/Notebook-AI/issues).

