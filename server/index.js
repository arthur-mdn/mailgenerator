const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3001;
const uploadFolder = path.join(__dirname, 'uploads');
const dataFile = path.join(__dirname, 'data', 'additionalContents.json');
const authFile = path.join(__dirname, 'data', 'modelsAuth.json');

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(uploadFolder));

if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);
if (!fs.existsSync(path.dirname(dataFile))) fs.mkdirSync(path.dirname(dataFile));
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify([]));
if (!fs.existsSync(authFile)) fs.writeFileSync(authFile, JSON.stringify({}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Math.random().toString(36).substring(2, 15)}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage });

app.use('/uploads', express.static(uploadFolder));

const writeData = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

app.get('/additional_content/:model', (req, res) => {
    const contents = JSON.parse(fs.readFileSync(dataFile));
    const { model } = req.params;
    const modelFiltered = model.replace(/-/g, '_');
    const filteredContents = contents.filter(item => item.model === modelFiltered.toLowerCase());
    if (filteredContents.length === 0) return res.status(404).json({ error: 'Aucun contenu trouvé pour ce modèle' });
    const defaultContent = filteredContents.find(item => item.isDefault);
    if (defaultContent) {
        filteredContents.forEach(item => {
            item.isDefault = item.filename === defaultContent.filename;
        });
    }
    res.json(filteredContents);
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

app.post('/upload_image', (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Erreur Multer:', err);
            return res.status(500).json({ error: 'Erreur lors de l\'upload.' });
        }

        try {
            const { title, model, password, setByDefault } = req.body;

            if (!req.file || !title || !model || !password) {
                return res.status(400).json({ error: 'Image, titre, modèle et mot de passe requis' });
            }

            const modelsAuth = JSON.parse(fs.readFileSync(authFile));
            if (!modelsAuth[model] || modelsAuth[model].password !== password) {
                return res.status(403).json({ error: 'Mot de passe incorrect ou modèle inconnu' });
            }

            const contents = JSON.parse(fs.readFileSync(dataFile));

            const shouldBeDefault = (contents.filter(c => c.model === model).length === 0) || (setByDefault === 'true');

            const newImage = {
                id: uuidv4(),
                title,
                filename: req.file.filename,
                originalname: req.file.originalname,
                url: `uploads/${req.file.filename}`,
                model,
                isDefault: shouldBeDefault,
            };

            contents.push(newImage);

            if (shouldBeDefault) {
                contents.forEach(item => {
                    if (item.model === model) {
                        item.isDefault = item.id === newImage.id;
                    }
                });
            }

            await writeData(dataFile, contents);

            const modelContents = contents.filter(item => item.model === model);

            return res.status(200).json({ message: 'Image téléversée avec succès', modelContents });

        } catch (e) {
            console.error('Erreur serveur:', e);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Erreur interne serveur.' });
            }
        }
    });
});

app.post('/set_default/:id', upload.none(), async (req, res) => {
    const {model, password} = req.body;
    const {id} = req.params;

    if (!id) return res.status(400).json({error: 'ID requis'});
    if (!model) return res.status(400).json({error: 'Modèle requis'});
    if (!password) return res.status(400).json({error: 'Mot de passe requis'});

    const modelsAuth = JSON.parse(fs.readFileSync(authFile));
    if (!modelsAuth[model] || modelsAuth[model].password !== password) {
        return res.status(403).json({error: 'Mot de passe incorrect ou modèle inconnu'});
    }

    const contents = JSON.parse(fs.readFileSync(dataFile));
    const content = contents.find(item => item.id === id);
    if (!content) return res.status(404).json({error: 'Contenu non trouvé'});

    contents.forEach(item => {
        if (item.model === model) {
            item.isDefault = item.id === id;
        }
    });

    await writeData(dataFile, contents);

    let modelContents = contents.filter(item => item.model === model);

    res.status(200).json({message: 'Contenu mis à jour avec succès', modelContents});
});

app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { model, password } = req.body;

    if (!id) return res.status(400).json({ error: 'ID requis' });
    if (!model) return res.status(400).json({ error: 'Modèle requis' });
    if (!password) return res.status(400).json({ error: 'Mot de passe requis' });

    const modelsAuth = JSON.parse(fs.readFileSync(authFile));
    if (!modelsAuth[model] || modelsAuth[model].password !== password) {
        return res.status(403).json({ error: 'Mot de passe incorrect ou modèle inconnu' });
    }

    const contents = JSON.parse(fs.readFileSync(dataFile));
    const contentIndex = contents.findIndex(item => item.id === id);
    if (contentIndex === -1) return res.status(404).json({ error: 'Contenu non trouvé' });

    const content = contents[contentIndex];
    contents.splice(contentIndex, 1);

    if (content.isDefault) {
        contents.forEach(item => {
            if (item.model === model) {
                item.isDefault = false;
            }
        });

        const newDefault = contents.find(item => item.model === model);
        if (newDefault) {
            newDefault.isDefault = true;
        }
    }

    await writeData(dataFile, contents);

    const modelContents = contents.filter(item => item.model === model);
    res.status(200).json({ message: 'Contenu supprimé avec succès', modelContents });
});

app.listen(port, () => {
    console.log(`API disponible sur http://localhost:${port}`);
});
