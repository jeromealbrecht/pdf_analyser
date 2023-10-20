const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const storage = multer.memoryStorage(); // Stockage en mémoire

const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(cors());

// Redirection pour la terminaison "/" pour la route /upload
app.use('/upload', (req, res, next) => {
  if (req.path === '/upload/' && req.method === 'POST') {
    return next(); // Permettre la requête HTTP POST avec la terminaison "/"
  }
  if (!req.path.endsWith('/') && req.method === 'POST') {
    const query = req.url.slice(req.path.length);
    res.redirect(307, req.path + '/' + query);
  } else {
    next();
  }
});

// Middleware pour gérer l'upload de fichiers
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé.' });
  }

  const uploadedFile = req.file;
  // Vous pouvez maintenant accéder aux propriétés du fichier, par exemple le nom d'origine et les données.
  const fileName = uploadedFile.originalname;
  const fileBuffer = uploadedFile.buffer;
  
  // Faites ce que vous devez avec le fichier, par exemple, enregistrez-le sur le disque ou traitez-le.
  
  // Envoyez une réponse appropriée
  res.status(200).json({ message: 'Fichier téléchargé avec succès', uploadedFile });
  res.status(200).json({ htmlContent: data });

  console.log(uploadedFile);
});


app.listen(3000, () => {
  console.log('Serveur en cours d\'écoute sur le port 3000');
});
