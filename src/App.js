import React, { useState, useEffect } from 'react';
import './custom.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetch('https://tutoringwebsite-backend.onrender.com/files') // Connects to my backend API
      .then((response) => response.json())
      .then((data) => setFileList(data.files))
      .catch((error) => console.error('Error fetching files:', error));
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch('https://tutoringwebsite-backend.onrender.com/upload', { 
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          alert('File uploaded successfully!');
          setSelectedFile(null);
          fetch('https://tutoringwebsite-backend.onrender.com/files') 
            .then((response) => response.json())
            .then((data) => setFileList(data.files))
            .catch((error) => console.error('Error fetching files:', error));
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          alert('Error uploading file. Please try again.');
        });
    } else {
      alert('Please select a file to upload.');
    }
  };
  const handleDelete = (fileId) => {
    const confirmed = window.confirm('Are you sure you want to delete this file?');
    if (confirmed) {
      fetch(`https://tutoringwebsite-backend.onrender.com/file/${fileId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.status === 200) {
            alert('File deleted successfully!');
            // Refreshing file list after deletion
            fetch('https://tutoringwebsite-backend.onrender.com/files')
              .then((response) => response.json())
              .then((data) => setFileList(data.files))
              .catch((error) => console.error('Error fetching files:', error));
          } else {
            alert('Error deleting file. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error deleting file:', error);
          alert('Error deleting file. Please try again.');
        });
    }
  };

  return (
    <div className="container-wrapper"> 
      <div className="container">
        <div className="header"> 
          <h1>File Upload and Download</h1>
          <div className="input-container">
            <label className="upload-label">
              Choose File
              <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
            </label>
            <label className="upload-label" onClick={handleUpload}>Upload</label>
          </div>
          {selectedFile && (
            <div>
              <p>Selected File: {selectedFile.name}</p>
            </div>
          )}
        </div>
        <div className="file-list-section">
          <h2>Existing Files:</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Download</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {fileList.map((file) => (
                <tr key={file._id}>
                  <td>{file.filename}</td>
                  <td>
                    <a href={`https://tutoringwebsite-backend.onrender.com/file/${file._id}`} download>
                      <button className="btn-primary">Download</button>
                    </a>
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(file._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );  
}

export default App;
