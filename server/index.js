// Backend Node.js complet avec Express
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 3001;
const uploadFolder = path.join(__dirname, 'uploads');
const dataFile = path.join(__dirname, 'data', 'additionalContents.json');

// Middleware
app.use(cors(
    {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));
app.use(bodyParser.json());
app.use(express.static(uploadFolder));

// Créer le dossier uploads et data s'ils n'existent pas
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);
if (!fs.existsSync(path.dirname(dataFile))) fs.mkdirSync(path.dirname(dataFile));
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([]));

// Configurer Multer pour l'upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Math.random().toString(36).substring(2, 15)}${ext}`;
        cb(null, filename);
    }
});

// seve uploads folder
app.use('/uploads', express.static(uploadFolder));

const upload = multer({ storage });

// GET route: retourner le JSON
app.get('/additional_content', (req, res) => {
    const contents = JSON.parse(fs.readFileSync(dataFile));
    res.json(contents);
});

app.get('/b64/:id', (req, res) => {
    const { id } = req.params;
    const contents = JSON.parse(fs.readFileSync(dataFile));
    const content = contents.find(item => item.id === id);
    if (!content) return res.status(404).json({ error: 'Contenu non trouvé' });
    const filePath = path.join(uploadFolder, content.filename);
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');
    res.send(base64);
});

// POST route: uploader une image avec titre
app.post('/upload_image', upload.single('image'), (req, res) => {
    const { title } = req.body;

    if (!req.file || !title) {
        return res.status(400).json({ error: 'Image et titre requis' });
    }

    const contents = JSON.parse(fs.readFileSync(dataFile));

    const newImage = {
        id: uuidv4(),
        title: title,
        filename: req.file.filename,
        originalname: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        isDefault: contents.length === 0
    };

    contents.push(newImage);
    fs.writeFileSync(dataFile, JSON.stringify(contents, null, 2));

    res.status(200).json(newImage);
});

// PUT route: définir l'image par défaut
app.put('/set_default_image', (req, res) => {
    const { filename } = req.body;
    if (!filename) return res.status(400).json({ error: 'filename requis' });

    const contents = JSON.parse(fs.readFileSync(dataFile));
    contents.forEach(item => item.isDefault = item.filename === filename);

    fs.writeFileSync(dataFile, JSON.stringify(contents, null, 2));
    res.status(200).json({ message: 'Image par défaut mise à jour' });
});

app.listen(port, () => {
    console.log(`API disponible sur http://localhost:${port}`);
});
