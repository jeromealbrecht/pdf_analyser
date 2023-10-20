import * as pdfjs from 'pdfjs-dist';

import React, { useState } from 'react';
import axios from 'axios';

function PDFUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [cvTitle, setCvTitle] = useState('Titre non trouvé');
  const [stacks, setStacks] = useState([]);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setIsConverting(true);

    try {
      // Conversion du PDF en HTML avec un serveur Node.js
      const htmlContent = await convertPDFtoHTML(file);
      console.log('html', htmlContent);
      if (htmlContent) {
        // Extrait le titre du CV
        const titleMatch = /Titre\s*:\s*(.*?)\s*/i.exec(htmlContent);

        if (titleMatch) {
          setCvTitle(titleMatch[1]);
        } else {
          setCvTitle('Titre non trouvé');
        }

        // Recherche des "stacks" dans le contenu HTML
        extractDataFromHTML(htmlContent);

        setIsConverting(false);
      } else {
        console.error('Erreur lors de la conversion PDF vers HTML');
        setIsConverting(false);
      }
    } catch (error) {
      console.error('Erreur lors du traitement du fichier PDF : ', error);
      setIsConverting(false);
    }
  };

  const convertPDFtoHTML = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Remplacez l'URL par celle de votre serveur Node.js
      const response = await axios.post('http://localhost:3000/upload', formData, {
        responseType: 'blob',
      });

      if (response.status === 200) {
        const reader = new FileReader();
        reader.readAsText(response.data);
        return new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
        });
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la conversion PDF vers HTML : ', error);
      return null;
    }
  };

  const extractDataFromHTML = (htmlContent) => {
    // Recherchez des technologies ou "stacks" spécifiques
    const technologies = ['React', 'Drupal', 'Svelte', 'Vue.js', 'SQL', 'Firebase', 'PHP'];

    const stacksFound = technologies.filter(tech => {
      const regex = new RegExp(tech, 'i'); // Utilisez une expression régulière pour correspondre en ignorant la casse
      return regex.test(htmlContent);
    });

    // Mettez à jour les "stacks" trouvés
    setStacks(stacksFound);
    console.log(stacks);
  };

  return (
    <div>
      <h1>Téléchargement de CV PDF</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      {isConverting && <p>Conversion en cours...</p>}
      {selectedFile && (
        <div>
          <p>Fichier sélectionné : {selectedFile.name}</p>
          <p>Titre du CV : {cvTitle}</p>
          <p>Stacks trouvés : {stacks.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default PDFUpload;

