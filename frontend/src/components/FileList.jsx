import { useEffect, useState } from 'react';
import axios from 'axios';

const FileList = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/files')  // Replace with your backend URL
            .then(response => setFiles(response.data))
            .catch(error => console.error('Error fetching files:', error));
    }, []);

    return (
        <div>
            <h2>Uploaded Files</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {files.map((file, index) => (
                    <div key={index}>
                        <p>{file.filename}</p>
                        <img
                            src={`http://localhost:5000/api/file/${file.filename}`}
                            alt={file.filename}
                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileList;
