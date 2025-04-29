import { useEffect, useState } from 'react';

export default function SelectAdditionalContent({ onSelect, model }) {
    const [additionalContents, setAdditionalContents] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdditionalContents = async () => {
            try {
                const modelFiltered = model.replace(/-/g, '_');

                const response = await fetch(`${import.meta.env.VITE_API_URL}/additional_content/${modelFiltered.toLowerCase()}`);
                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format');
                }
                setAdditionalContents(data);

                const defaultContent = data.find(item => item.isDefault);
                if (defaultContent) {
                    selectContent(defaultContent);
                }
            } catch (error) {
                setError('Erreur lors du chargement des contenus supplémentaires ' + error.message);
            }
        };

        fetchAdditionalContents();
    }, []);

    const selectContent = async (content) => {
        setSelectedId(content.id);
        try {
            if (content.url.includes('uploads')) {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/b64/${content.id}`);
                const base64 = await res.text();
                onSelect(base64);
            } else {
                const res = await fetch(content.url);
                const blob = await res.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result;
                    onSelect(base64);
                };
                reader.readAsDataURL(blob);
            }
        } catch (error) {
            setError('Erreur lors de la sélection du contenu ' + error.message);
        }
    };

    return (
        <>
            {error && <div style={{color: 'red'}}>{error}</div>}
            <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem'}}>
                {additionalContents.map(content => (
                    <div
                        key={content.id}
                        onClick={() => selectContent(content)}
                        style={{
                            border: selectedId === content.id ? '2px solid #00AE5E' : '2px solid #ccc',
                            padding: '5px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: 'border 0.3s',
                            backgroundColor: '#fff'
                        }}
                    >
                        <img
                            src={`${!content.url.includes('uploads') ? content.url : `${import.meta.env.VITE_API_URL}/${content.url}`}`}
                            alt={content.title}
                            style={{width: '150px', aspectRatio:'16/9', height: 'auto', objectFit: 'cover', borderRadius: '6px'}}
                        />
                        <div style={{textAlign: 'center', marginTop: '5px', fontSize: '14px'}}>{content.title}</div>
                        {content.warning && (
                            <div style={{color: 'red', fontSize: '12px', textAlign: 'center'}}>
                                {content.warning}
                            </div>
                        )}
                    </div>
                ))}

                <div
                    onClick={
                    async () => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/*';
                        fileInput.onchange = async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
                            if (!validImageTypes.includes(file.type)) {
                                setError('Type de fichier invalide. Veuillez choisir une image JPEG, PNG ou GIF.');
                                return;
                            }

                            if (file.size > 2 * 1024 * 1024) {
                                setError('Le fichier est trop volumineux. Veuillez choisir une image de moins de 2 Mo.');
                                return;
                            }

                            const img = new Image();
                            img.src = URL.createObjectURL(file);
                            img.onload = async () => {
                                let warning = null;
                                const ratio = img.width / img.height;
                                if (Math.abs(ratio - 16/9) > 0.05) {
                                    warning = "Format recommandé 16:9 pour un meilleur rendu.";
                                }

                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    const base64 = reader.result;
                                    onSelect(base64);

                                    const id = Date.now().toString();

                                    setAdditionalContents(prev => [
                                        ...prev,
                                        {
                                            id: id,
                                            title: file.name,
                                            filename: file.name,
                                            url: URL.createObjectURL(file),
                                            isDefault: false,
                                            warning: warning
                                        }
                                    ]);

                                    setSelectedId(id);
                                };
                                reader.readAsDataURL(file);
                            };
                        };
                        fileInput.click();
                    }}


                    style={{
                        border: '2px dashed #ccc',
                        padding: '5px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'border 0.3s',
                        backgroundColor: '#fff',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '150px',
                    }}
                >
                    <img
                        src="/elements/upload.png"
                        alt="Upload"
                        style={{width: '50px', height: 'auto', objectFit: 'cover', opacity: '0.25'}}
                    />
                </div>
            </div>
        </>
    );
}