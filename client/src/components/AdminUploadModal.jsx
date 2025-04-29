import { useEffect, useState } from 'react';
import {FaUpload} from "react-icons/fa6";
import {FiUpload} from "react-icons/fi";

export default function AdminUploadModal({ modelKey }) {
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [setByDefault, setSetByDefault] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchImages = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/additional_content/${modelKey}`);
            const data = await res.json();
            if (res.ok) {
                setImages(data);
                setError('');
            } else {
                setError(data.error || 'Erreur de chargement.');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur réseau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, [modelKey]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(selected.type)) {
            setError('Fichier invalide : JPEG, PNG ou GIF uniquement.');
            return;
        }

        if (selected.size > 2 * 1024 * 1024) {
            setError('Fichier trop volumineux (max 2 Mo).');
            return;
        }

        const img = new Image();
        img.src = URL.createObjectURL(selected);
        img.onload = () => {
            const ratio = img.width / img.height;
            if (Math.abs(ratio - 16 / 9) > 0.05) {
                setError('Format recommandé : 16:9 pour un meilleur rendu.');
            } else {
                setError('');
            }
            setFile(selected);
        };
        img.onerror = () => {
            setError('Erreur de lecture du fichier.');
        };
    };

    const handleUpload = async () => {
        if (!file || !title || !password) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('image', file);
            formData.append('title', title);
            formData.append('model', modelKey);
            formData.append('password', password);
            formData.append('setByDefault', setByDefault ? 'true' : 'false');

            const res = await fetch(`${API_URL}/upload_image`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Image téléversée avec succès.');
                setError('');
                setFile(null);
                setTitle('');
                setSetByDefault(false);
                setImages(data.modelContents);
            } else {
                setError(data.error || 'Erreur lors du téléversement.');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur réseau.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: modelKey, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setImages(data.modelContents);
                setSuccess('Image supprimée.');
                setError('');
            } else {
                setError(data.error || 'Erreur lors de la suppression.');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur réseau.');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const formData = new FormData();
            formData.append('model', modelKey);
            formData.append('password', password);

            const res = await fetch(`${API_URL}/set_default/${id}`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setImages(data.modelContents);
                setSuccess('Image définie par défaut.');
                setError('');
            } else {
                setError(data.error || 'Erreur lors de la mise par défaut.');
            }
        } catch (err) {
            console.error(err);
            setError('Erreur réseau.');
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
            <h2>Gestion des images pour : {modelKey}</h2>

            {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: 10 }}>{success}</div>}

            {/* FORMULAIRE UPLOAD */}
            <div style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {file ? (
                    <div
                        onClick={() => setFile(null)}
                        style={{border: '2px dashed #ccc', padding: 20, textAlign: 'center', cursor: 'pointer', borderRadius: 8}}
                    >
                        <img src={URL.createObjectURL(file)} alt="preview" style={{maxWidth: '100%', maxHeight: 200, objectFit: 'contain'}}/>
                        <p style={{color: '#888'}}>Cliquer pour changer d'image</p>
                    </div>
                ) : (
                    <label style={{border: '2px dashed #ccc', padding: 20, textAlign: 'center', cursor: 'pointer', borderRadius: 8, display:'flex', flexDirection:'column', gap:'0.5rem', alignItems:'center'}}>
                        <p>Choisir une image</p>
                        <img src={'/elements/upload.png'} alt="upload" style={{width: 50, height: 50, opacity:0.3}}/>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{display: 'none'}}/>
                    </label>
                )}

                <label>
                    <span>Titre de l'image</span>
                    <input
                        type="text"
                        placeholder="Annonce de l'évènement"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>

                <label>
                    <span>Mot de passe</span>
                    <input
                        type="password"
                        placeholder="*********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={setByDefault}
                        onChange={(e) => setSetByDefault(e.target.checked)}
                    /> Définir comme image par défaut
                </label>

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    style={{backgroundColor: '#00ae5e', color: 'white', padding: '10px 20px', borderRadius: 5, border: 'none'}}
                >

                    {loading ? (
                        <>
                            <span className="loader" style={{border: '2px solid white', borderRadius: '50%', width: 15, height: 15, marginRight: 5}}></span>
                            <span>Chargement...</span>
                        </>
                    ) : (
                        <>
                            <FiUpload/>
                            Uploader
                        </>
                    )}
                </button>
            </div>

            {/* GALERIE */}
            <br/>
            <h3>Images existantes</h3>
            {loading ? (
                <p>Chargement des images...</p>
            ) : (
                <div style={{display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {images.map((img) => (
                        <div key={img.id} style={{ border: '1px solid #ccc', padding: 10, borderRadius: 8, width: 120 }}>
                            <img
                                src={`${API_URL}/${img.url}`}
                                alt={img.title}
                                style={{ width: '100%', height: 80, objectFit: 'cover', marginBottom: 5 }}
                            />
                            <p style={{ fontSize: 12, marginBottom: 5 }}>{img.title}</p>
                            {img.isDefault && <div style={{ fontSize: 10, color: 'green' }}>Par défaut</div>}
                            <div style={{ marginTop: 5 }}>
                                {!img.isDefault && (
                                    <button onClick={() => handleSetDefault(img.id)} style={{ fontSize: 10, marginBottom: 5 }}>
                                        Définir défaut
                                    </button>
                                )}
                                <button onClick={() => handleDelete(img.id)} style={{ fontSize: 10, color: 'red' }}>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
