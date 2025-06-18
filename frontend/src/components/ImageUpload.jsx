import { useState } from 'react';
import axios from 'axios';
import './ImageUpload.css'; // Import the CSS file

const ImageUpload = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const [cleanedText, setCleanedText] = useState('');
    const [noteData,setNoteData] = useState({
        noteName:"",
        user:"",
        imageName:"", 
        extractText:extractedText,
        cleanedText: cleanedText,
        time: "",
    })

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file)); // Generate preview URL
        setNoteData((prev)=>({...prev,imageName:file.name}));
    };

    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image first!");
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append("imageName",image.name);

        try {
            const response = await axios.post('http://localhost:4000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setExtractedText(response.data.extracted_text);
            setCleanedText(response.data.cleaned_text);

            setNoteData((prev)=>({
                ...prev,
                extractedText: response.data.extracted_text,
                cleanedText: response.data.cleaned_text,
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleSave = async () => {
        if (!image) {
            alert("Please select an image first!");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);  // ✅ Sending image
        formData.append("noteName", noteData.noteName);
        formData.append("user", noteData.user);
        formData.append("imageName", noteData.imageName);
        formData.append("extractText", noteData.extractText);
        formData.append("cleanedText", noteData.cleanedText);
        formData.append("time", new Date().toISOString());

        try {
            const response = await axios.post('http://localhost:5000/api/save', formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Data saved successfully", response.data);
        } catch (error) {
            console.error("Error saving data:", error.response?.data || error);
        }
    };


    return (
        <div className="upload-container">
            <h2>Upload Image</h2>
            <div className='flex gap-4 '>
                <input type="file" onChange={handleImageChange} className="border rounded-xl p-5 " />
                <button onClick={handleUpload} className="px-5 py-3 bg-green-600 text-white border-none rounded-xl cursor-pointer text-lg">Upload</button>
            </div>
            
            {imagePreview && (
                <div className="image-preview">
                    <h3 className='my-4 font-bold'>Selected Image:</h3>
                    <img src={imagePreview} alt="Uploaded Preview" className=' rounded-2xl'/>
                </div>
            )}
        <div className='flex flex-row gap-5'>
            {extractedText && (
                <div className="result-text w-[45%]">
                    <h3>Extracted Text:</h3>
                    <p>{extractedText}</p>
                </div>
            )}

            {cleanedText && (
                    <div className="result-text w-[45%]">
                    <h3>Cleaned Text:</h3>
                    <p>{cleanedText}</p>
                </div>
            )}
        </div>
        {cleanedText && (
                <div className='my-10'>
                    <button className='px-5 py-3 bg-green-600 text-white border-none rounded-xl cursor-pointer text-lgbg-green-600'
                        onClick={handleSave}
                    >Save</button>

                </div>
        )}
         </div>
    );
};

export default ImageUpload;
