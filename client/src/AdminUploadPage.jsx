import { useParams } from 'react-router-dom';
import AdminUploadModal from "./components/AdminUploadModal.jsx";

export default function AdminUploadPage() {
    const { model } = useParams();

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <AdminUploadModal modelKey={model} />
        </div>
    );
}
