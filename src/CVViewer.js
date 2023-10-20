import React, { useEffect, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function CVViewer({ file }) {
  const [htmlContent, setHtmlContent] = useState('');
  const [stacksFound, setStacksFound] = useState([]);
  const [keyFound, setKeyFound] = useState([]);
  const [jobFound, setJobFound] = useState([]);

  useEffect(() => {
    // Convertir le PDF en HTML
    const convertPDFtoHTML = async (file) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfData = new Uint8Array(arrayBuffer);
        const loadingTask = pdfjs.getDocument(pdfData);

        const pdfDocument = await loadingTask.promise;
        let text = '';

        for (let i = 1; i <= pdfDocument.numPages; i++) {
          const page = await pdfDocument.getPage(i);
          const textContent = await page.getTextContent();
          text += textContent.items.map((s) => s.str).join(' ');
        }

        return text;
      } catch (error) {
        console.error('Erreur lors de la conversion du PDF en ArrayBuffer :', error);
      }
    };

    // Extraire les technologies du CV
    const extractStacks = (text) => {
      const technologies = [
        'React', 'Drupal', 'Svelte', 'Vue.js', 'SQL', 'Firebase', 'PHP', 'Python', 'Excel',
        'React-Native', 'Photoshop', 'Illustrator', 'Première pro', 'Cubase'
      ];
      const stacks = technologies.filter((tech) => new RegExp(tech, 'i').test(text));
      return stacks;
    };

    // Extraire les qualités du CV
    const extractQualities = (text) => {
      const qualities = [
        'Esprit d\'équipe', 'Autonomie', 'Création', 'Créatif', 'Formation', 'Entrepreneur', 'Management'
      ];
      const foundQualities = qualities.filter((quality) => new RegExp(quality, 'i').test(text));

      // Supprimer les doublons en convertissant le tableau en un ensemble (Set) temporaire
      const uniqueQualities = [...new Set(foundQualities)];

      return uniqueQualities;
    };

    // Extraire les expériences du CV
    const extractExperiences = (text) => {
      const techJobTitles = [
        'Développeur Web', 'Développeur Drupal', 'Développeur logiciel', 'Développeur Vue JS',
        'Technicien audiovisuel', 'DevOps', 'Administrateur système', 'Ingénieur du son'
      ];
      const jobExperiences = [];

      techJobTitles.forEach((jobTitle) => {
        const regex = new RegExp(jobTitle, 'i');
        const matches = text.match(regex);

        if (matches) {
          // Extraire les informations pertinentes à partir de matches et ajouter à jobExperiences
          jobExperiences.push({
            title: jobTitle,
            // Extraire d'autres informations ici
          });
        }
      });

      return jobExperiences;
    };

    const loadPDFContent = async () => {
      const text = await convertPDFtoHTML(file);
      setHtmlContent(text);
      console.log(htmlContent);
      const stacks = extractStacks(text);
      setStacksFound(stacks);

      const qualities = extractQualities(text);
      setKeyFound(qualities);

      const exp = extractExperiences(text);
      setJobFound(exp);
    };

    loadPDFContent();
  }, [file]);

  const escapedHtmlContent = htmlContent ? htmlContent.replace(/</g, '&lt;') : '';
  
  return (
    <div>
      <div>
        <p className='p-title mt1'>Contenu du CV au format texte :</p>
        {/* <pre>{escapedHtmlContent}</pre> */}
      </div>
      <div className="stack-container">
        {/* Technologies */}
        <p className='p-title mt1'>Technologies trouvées dans le CV :</p><br/>
        <ul className="ul-stack">
          {stacksFound.map((stack) => (
            <li className="li-stack" key={stack}>{stack}</li>
          ))}
        </ul>
        {/* Qualités */}
        <p className='p-title mt1'>Qualités trouvées dans le CV :</p><br/>
        <ul className="ul-stack">
          {keyFound.map((quality) => (
            <li className="li-stack" key={quality}>{quality}</li>
          ))}
        </ul>
        {/* Expériences */}
        <p className='p-title mt1'>Expériences candidat :</p><br/>
        <ul className="ul-stack">
          {jobFound.map((exp, index) => (
            <li className="li-stack" key={exp}>
              <p>{exp.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CVViewer;
