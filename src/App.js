import React, { useState } from 'react';
import CVViewer from './CVViewer'; // Assurez-vous que le chemin du composant CVViewer est correct

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className='title_input'>
      <h1 className='mt1'>Analiseur de CV PDF</h1>
      <input className='mt1' type="file" accept=".pdf" onChange={handleFileChange} />
      {selectedFile && <CVViewer file={selectedFile} />}
    </div>
  );
}

export default App;
