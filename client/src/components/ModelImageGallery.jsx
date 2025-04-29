import { useEffect, useState } from 'react';

export default function ModelImageGallery({ modelKey, refresh, password }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchImages = async () => {
        try {

            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/additional_content/${modelKey}`);
            const data = await res.json();
            if (res.ok) {
                setImages(data);
                setError('');
            } else {
                setError(data.error || 'Erreur lors du chargement des images.');
            }
        } catch (err) {
            console.error(err);
            setError("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, [modelKey, refresh]);

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: modelKey,
                    password: password
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setImages(data.modelContents);
                onRefresh?.();
            } else {
                const data = await res.json();
                setError(data.error || 'Erreur lors de la suppression.');
            }
        } catch (err) {
            console.error(err);
            setError("Erreur réseau.");
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const formData = new FormData();
            formData.append('model', modelKey);
            formData.append('password', password);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/set_default/${id}`, {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                const updatedImages = images.map(img => ({
                    ...img,
                    isDefault: img.id === id,
                }));
                setImages(updatedImages);
                onRefresh?.();
            } else {
                const data = await res.json();
                setError(data.error || 'Erreur lors de la mise à jour.');
            }
        } catch (err) {
            console.error(err);
            setError("Erreur réseau.");
        }
    };

    return (
        <div style={{ marginTop: 20 }}>
            <h4>Images existantes</h4>
            {loading ? (
                <p>Chargement...</p>
            ) :(
                <>
                    {error && <div style={{color: 'red'}}>{error}</div>}
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: 10}}>
                        {images.map(img => (
                            <div key={img.id} style={{border: '1px solid #ccc', padding: 10, borderRadius: 5}}>
                                <img src={`${import.meta.env.VITE_API_URL}/${img.url}`}
                                     alt={img.title} style={{width: 100, height: 100, objectFit: 'cover'}}/>
                                <p>{img.title}</p>
                                <button onClick={() => handleDelete(img.id)} style={{marginRight: 5}}>Supprimer</button>
                                {img.isDefault && <span style={{color: 'green'}}>Par défaut</span>}
                                {!img.isDefault && <button onClick={() => handleSetDefault(img.id)}>
                                    Définir par défaut
                                    </button>
                                    }
                                    </div>
                                    ))}
                            </div>
                            </>

                            )}
                    </div>
                    );
}
