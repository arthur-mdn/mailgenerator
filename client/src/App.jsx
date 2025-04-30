import {useEffect, useRef, useState} from 'react'
import './App.css'
import { icons } from './assets/icons.js';
import SelectAdditionalContent from "./components/SelectAdditionalContent.jsx";
import { FiSliders, FiShare, FiDownload, FiClipboard, FiCode } from 'react-icons/fi';
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { SiThunderbird } from "react-icons/si";
import { Helmet } from 'react-helmet';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { edissyum } from './models/edissyum';
import {FaChevronCircleDown, FaChevronUp} from "react-icons/fa";
import {FaChevronDown} from "react-icons/fa6";
import {MdAdminPanelSettings} from "react-icons/md";
import AdminUploadModal from "./components/AdminUploadModal.jsx";

const models = {
    edissyum: edissyum
};

const pathname = window.location.pathname.replace('/', '');
const activeModel = models[pathname] || 'notfound';

const generateFullHTML = (bodyContent) => {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="color-scheme" content="light dark">
  <title>Signature</title>
</head>
<body style="margin:0; padding:0;">
  ${bodyContent}
</body>
</html>`;
};

function ExportViaDownloadHTML({signatureRef, lastname, firstname}) {
    let pseudo = `${firstname} ${lastname}`;
    pseudo = pseudo.replace(/[^a-zA-Z0-9]/g, '_');
    if(!pseudo){
        pseudo = 'Signature';
    }
    else {
        pseudo = 'Signature_' + pseudo;
    }

    const htmlContent = generateFullHTML(signatureRef.current ? signatureRef.current.innerHTML : '');

    return (
        <a
            href={`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`}
            download={`${pseudo}.html`}
            style={{textDecoration: 'none', color: '#00AE5E'}}
        >
            <button style={{padding: '10px 20px', cursor: 'pointer', backgroundColor: '#00AE5E', color: '#fff', border: 'none', borderRadius: '5px'}}>
                <FiDownload/>
                Télécharger la signature
            </button>
        </a>
    )
}

function ExportViaOutlookZip({ signatureRef, additionalContent, getFormData }) {

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const handleExportZip = async () => {
        const { firstname, lastname, role, phone, mobile } = getFormData();

        const email = prompt('Veuillez entrer votre adresse e-mail (ex: utilisateur@exemple.com)');

        if (!email) {
            alert('Adresse e-mail requise pour générer les fichiers Outlook.');
            return;
        }

        const zip = new JSZip();

        let pseudo = `${firstname} ${lastname}`.replace(/[^a-zA-Z0-9]/g, '_') || 'Signature';
        const signatureName = `${pseudo} (${email})`;

        const signatureFolder = zip.folder(signatureName);
        const imagesFolder = signatureFolder.folder(`${signatureName}_files`);

        let html = signatureRef.current.innerHTML;
        html = generateFullHTML(html);

        const imagesToInclude = [
            { base64: icons.edissyum, name: 'logo.png' },
            { base64: icons.facebook, name: 'facebook.png' },
            { base64: icons.linkedin, name: 'linkedin.png' },
            { base64: icons.youtube, name: 'youtube.png' }
        ];

        if (additionalContent && additionalContent.includes('base64')) {
            imagesToInclude.push({ base64: additionalContent, name: 'additional.png' });
        }

        imagesToInclude.forEach((img) => {
            html = html.replace(
                new RegExp(escapeRegExp(img.base64), 'g'),
                `${signatureName}_files/${img.name}`
            );
        });

        signatureFolder.file(`${signatureName}.htm`, html);

        let textContent = `${firstname} ${lastname}\n${role}`;
        if (phone) textContent += `\nTel: ${phone}`;
        if (mobile) textContent += `\nMobile: ${mobile}`;

        signatureFolder.file(`${signatureName}.txt`, textContent);
        signatureFolder.file(`${signatureName}.rtf`, '');

        for (const img of imagesToInclude) {
            const base64Data = img.base64.split(',')[1];
            imagesFolder.file(img.name, base64Data, { base64: true });
        }

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${signatureName}_Signature.zip`);
    };

    return (
        <button
            onClick={handleExportZip}
            style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#00AE5E',
                color: '#fff',
                marginTop: '10px'
            }}
        >
            <FiDownload />
            Télécharger pour Ancien Outlook (.zip)
        </button>
    );
}



function ExportViaCopy({handleCopy}) {
    return (
        <button
            onClick={handleCopy}
            style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#00AE5E',
                color: '#fff',
            }}
        >
            <FiClipboard/>
            Copier la signature
        </button>
    )
}

function ExportViaCustom({signatureRef}){
    return (
        <>
            <textarea
                style={{width: '100%', height: 200, resize: 'none'}}
                value={signatureRef.current ? generateFullHTML(signatureRef.current.innerHTML) : ''}
                readOnly
                onClick={() => {
                    const range = document.createRange();
                    range.selectNode(signatureRef.current);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);

                    try {
                        document.execCommand('copy');
                        alert('Signature copiée avec style !');
                    } catch (err) {
                        alert("Échec de la copie.");
                        console.error(err);
                    }

                    selection.removeAllRanges();
                }
                }
            />
        </>
    )
}

const generateFullHTMLWithEmbeddedImages = ({ html, images }) => {
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    images.forEach((img) => {
        html = html.replace(
            new RegExp(escapeRegExp(img.base64), 'g'),
            img.base64
        );
    });

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="color-scheme" content="light dark">
  <title>Signature</title>
</head>
<body style="margin:0; padding:0;">
  ${html}
</body>
</html>`;
};

function ExportViaOutlookInlineHTML({ signatureRef, additionalContent, getFormData }) {
    const handleDownload = () => {
        const { firstname, lastname } = getFormData();

        const email = prompt('Veuillez entrer votre adresse e-mail (ex: utilisateur@exemple.com)');
        if (!email) {
            alert('Adresse e-mail requise pour générer le fichier HTML.');
            return;
        }

        const htmlContent = signatureRef.current.innerHTML;

        const imagesToInclude = [
            { base64: icons.edissyum, name: 'logo.png' },
            { base64: icons.facebook, name: 'facebook.png' },
            { base64: icons.linkedin, name: 'linkedin.png' },
            { base64: icons.youtube, name: 'youtube.png' }
        ];

        if (additionalContent && additionalContent.includes('base64')) {
            imagesToInclude.push({ base64: additionalContent, name: 'additional.png' });
        }

        const fullHTML = generateFullHTMLWithEmbeddedImages({
            html: htmlContent,
            images: imagesToInclude
        });

        let pseudo = `${firstname} ${lastname}`.replace(/[^a-zA-Z0-9]/g, '_') || 'Signature';
        const filename = `${pseudo} (${email})_OutlookBase64.html`;

        const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
        saveAs(blob, filename);
    };

    return (
        <button
            onClick={handleDownload}
            style={{
                padding: '10px 20px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#00AE5E',
                color: '#fff',
                marginTop: '10px'
            }}
        >
            <FiDownload />
            Télécharger HTML avec images embarquées (Outlook)
        </button>
    );
}



function App() {
    const signatureRef = useRef(null);
    const [tab, setTab] = useState('inputs');
    const [exportTab, setExportTab] = useState('thunderbird');
    const [showOutlookOldSteps, setShowOutlookOldSteps] = useState(false);
    const [showOutlookNewSteps, setShowOutlookNewSteps] = useState(false);
    const [showThunderbirdSteps, setShowThunderbirdSteps] = useState(false);

    const [width, setWidth] = useState(600);
    const [height, setHeight] = useState(235);
    const [showSocialNetworks, setShowSocialNetworks] = useState(false);
    const [showAdditionalContent, setShowAdditionalContent] = useState(false);
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');

    const [additionalContent, setAdditionalContent] = useState('');

    const handleCopy = () => {
        const range = document.createRange();
        range.selectNode(signatureRef.current);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
            alert('Signature copiée avec style !');
        } catch (err) {
            alert("Échec de la copie.");
            console.error(err);
        }

        selection.removeAllRanges();
    };

    const updateWidth = () => {
        if (showSocialNetworks) {
            setWidth(600);
            if (showAdditionalContent){
                setWidth(700);
            }
        } else {
            setWidth(450);
            if (showAdditionalContent){
                setWidth(700);
            }
        }
    }

    const updateHeight = () => {
        if (mobile.trim() === '') {
            setHeight(200);
        } else {
            setHeight(235);
        }
    }

    useEffect(() => {

        updateHeight();
        updateWidth();
    }, [showSocialNetworks,showAdditionalContent, mobile]);

    const setBase64 = async (base64) => {
        try {
            setAdditionalContent(base64);
        }
        catch (error) {
            console.error('Erreur lors du chargement de l\'image en base64:', error);
        }
    }

    if(activeModel === 'notfound'){
        return (
            <div style={{fontFamily: 'Arial, sans-serif', display:'flex', flexDirection:'column', gap:'1rem', alignItems:'center'}}>
                <h1>Modèle non trouvé</h1>
                <p>Le modèle que vous avez demandé n'existe pas.</p>
            </div>
        )
    }

    return (
        <div style={{fontFamily: 'Arial, sans-serif', display:'flex', flexDirection:'column', gap:'1rem', alignItems:'center'}}>
            <Helmet>
                <title>Signature {activeModel.name}</title>
                <meta name="description" content="Générateur de signature email" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href={activeModel.favicon} />
            </Helmet>
            <div className={"tabs"}>

                <label htmlFor={"tab_inputs"} className={"tab"}>
                    <FiSliders/>
                    <input type={"radio"} name={"tab"} id={"tab_inputs"} value={"inputs"} checked={tab === 'inputs'} onChange={() => setTab('inputs')}/>
                    Modification
                </label>
                <label htmlFor={"tab_export"} className={"tab"}>
                    <FiShare/>
                    <input type={"radio"} name={"tab"} id={"tab_export"} value={"export"} checked={tab === 'export'} onChange={() => setTab('export')}/>
                    Exportation
                </label>
                <label htmlFor={"tab_admin"} className={"tab"}>
                    <MdAdminPanelSettings/>
                    <input type={"radio"} name={"tab"} id={"tab_admin"} value={"admin"} checked={tab === 'admin'} onChange={() => setTab('admin')}/>
                    Administration
                </label>
            </div>

            {
                tab === 'inputs' && (
                    <form className={"form_window"} style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', textAlign: 'left'}}>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                            <div style={{marginBottom: 10}}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={showAdditionalContent}
                                        onChange={() => setShowAdditionalContent(!showAdditionalContent)}
                                    />
                                    Afficher le contenu additionnel
                                </label>
                                {showAdditionalContent && (
                                    <>

                                        <SelectAdditionalContent onSelect={setBase64} model={activeModel.name}/>
                                    </>
                                )}
                            </div>

                            <label className={"input_container"}>
                                Prénom
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Arthur"
                                    maxLength={20}
                                />
                            </label>
                            <label className={"input_container"}>
                                Nom
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Mondon"
                                    maxLength={20}
                                />
                            </label>

                            <label className={"input_container"}>
                                Fonction
                                <input
                                    type="text"
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="Pôle expertise et développement"
                                    maxLength={45}
                                />
                            </label>
                            <label className={"input_container"}>
                                Téléphone
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+33 4 90 40 91 86"
                                    maxLength={20}
                                />
                            </label>
                            <label className={"input_container"}>
                                Mobile
                                <input
                                    type="tel"
                                    required
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="+33 6 78 91 01 12"
                                    maxLength={20}
                                />
                            </label>
                            <label style={{paddingTop: 10}}>
                                <input
                                    type="checkbox"
                                    checked={showSocialNetworks}
                                    onChange={() => setShowSocialNetworks(!showSocialNetworks)}
                                />
                                Afficher les réseaux sociaux
                            </label>
                        </div>
                    </form>

                )
            }

            {
                tab === 'export' && (
                    <div className={"export_window"} style={{backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', textAlign: 'left', display:'flex', flexDirection:'column', gap:'0.5rem'}}>

                        <div className={"export_tabs"}>
                            <label className={"export_tab"}>
                                <input
                                    type="radio"
                                    name="exportTab"
                                    value="thunderbird"
                                    checked={exportTab === 'thunderbird'}
                                    onChange={() => setExportTab('thunderbird')}
                                />
                                <SiThunderbird/>
                            </label>
                            <label className={"export_tab"}>
                                <input
                                    type="radio"
                                    name="exportTab"
                                    value="outlook"
                                    checked={exportTab === 'outlook'}
                                    onChange={() => setExportTab('outlook')}
                                />
                                <PiMicrosoftOutlookLogoFill/>
                            </label>
                            <label className={"export_tab"}>
                                <input
                                    type="radio"
                                    name="exportTab"
                                    value="html"
                                    checked={exportTab === 'html'}
                                    onChange={() => setExportTab('html')}
                                />
                                <FiCode/>
                            </label>
                        </div>

                        {
                            exportTab === 'thunderbird' && (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    <h3>Thunderbird</h3>
                                    <p>Pour Thunderbird, cliquez sur le bouton ci-dessous.</p>

                                    <p>Téléchargez la signature au format HTML.</p>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: '#f0f0f0', padding: '10px 15px', borderRadius: '5px'}} className={"outlook_steps"}
                                         onClick={() => setShowThunderbirdSteps(!showThunderbirdSteps)}>
                                        <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem'}}>
                                            {showThunderbirdSteps ? <FaChevronUp/> : <FaChevronDown/>}
                                            <p style={{margin: 0}}>Démarches à suivre</p>
                                        </div>

                                        {
                                            showThunderbirdSteps && (
                                                <ol>
                                                    <li>Ouvrez Thunderbird.</li>
                                                    <li>Allez dans "Outils" &gt; "Paramètres des comptes".</li>
                                                    <li>Sélectionnez le compte pour lequel vous souhaitez ajouter la signature.</li>
                                                    <li> Activez "Apposer la signature à partir d'un fichier" et sélectionnez le fichier HTML que vous avez téléchargé.</li>
                                                </ol>
                                            )
                                        }
                                    </div>
                                    <ExportViaDownloadHTML signatureRef={signatureRef} firstname={firstName} lastname={lastName}/>
                                </div>
                            )
                        }

                        {
                            exportTab === 'outlook' && (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    <h3>Outlook</h3>
                                    <p><strong>Nouvelle version Outlook :</strong> (copier/coller directement)</p>

                                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: '#f0f0f0', padding: '10px 15px', borderRadius: '5px'}} className={"outlook_steps"}
                                         onClick={() => setShowOutlookNewSteps(!showOutlookNewSteps)}>
                                        <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem'}}>
                                            {showOutlookNewSteps ? <FaChevronUp/> : <FaChevronDown/>}
                                            <p style={{margin: 0}}>Démarches à suivre</p>
                                        </div>

                                        {
                                            showOutlookNewSteps && (
                                                <ol>
                                                    <li>Ouvrez Outlook.</li>
                                                    <li>Allez dans "Fichier" &gt; "Options" &gt; "Courrier" &gt; "Signatures".</li>
                                                    <li>Cliquez sur "Nouveau" et donnez un nom à votre signature.</li>
                                                    <li>Collez la signature ci-dessous dans le champ de texte.</li>
                                                    <li>Enregistrez et fermez la fenêtre.</li>
                                                </ol>
                                            )
                                        }
                                    </div>

                                    <ExportViaCopy handleCopy={handleCopy}/>
                                    <br/>
                                    <p><strong>Ancienne version Outlook :</strong> (Contenu du dossier ZIP à glisser dans le dossier Signatures)</p>
                                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: '#f0f0f0', padding: '10px 15px', borderRadius: '5px'}} className={"outlook_steps"}
                                         onClick={() => setShowOutlookOldSteps(!showOutlookOldSteps)}>
                                        <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem'}}>
                                            {showOutlookOldSteps ? <FaChevronUp/> : <FaChevronDown/>}
                                            <p style={{margin: 0}}>Démarches à suivre</p>
                                        </div>

                                        {
                                            showOutlookOldSteps && (
                                                <ol>
                                                    <li>Téléchargez la signature au format ZIP.</li>
                                                    <li>Décompressez le dossier ZIP.</li>
                                                    <li>Ouvrez "C:\Users\VotreNom\AppData\Roaming\Microsoft\Signatures"</li>
                                                    <li>Glissez le contenu du dossier décompressé dans le dossier Signatures.</li>
                                                    <li>Ouvrez Outlook et allez dans "Fichier" &gt; "Options" &gt; "Mail" &gt; "Signatures".</li>
                                                    <li>Choisissez la signature que vous venez d'ajouter.</li>
                                                </ol>
                                            )
                                        }
                                    </div>


                                    <ExportViaOutlookZip
                                        signatureRef={signatureRef}
                                        additionalContent={additionalContent}
                                        getFormData={() => ({
                                            firstname: firstName || 'Arthur',
                                            lastname: lastName || 'Mondon',
                                            role: role || 'Pôle expertise et développement',
                                            phone: phone || '+33 4 90 40 91 86',
                                            mobile: mobile || ''
                                        })}
                                    />

                                    <ExportViaOutlookInlineHTML
                                        signatureRef={signatureRef}
                                        additionalContent={additionalContent}
                                        getFormData={() => ({
                                            firstname: firstName || 'Arthur',
                                            lastname: lastName || 'Mondon',
                                            role: role || 'Pôle expertise et développement',
                                            phone: phone || '+33 4 90 40 91 86',
                                            mobile: mobile || ''
                                        })}
                                        />

                                </div>
                            )
                        }

                        {
                            exportTab === 'html' && (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                    <h3>HTML</h3>
                                    <p>Pour d'autres clients de messagerie, copiez le code HTML ci-dessous et collez-le dans votre client de messagerie..</p>
                                    <ExportViaCustom signatureRef={signatureRef}/>
                                </div>
                            )
                        }
                    </div>

                )
            }
            {
                tab === 'admin' && (
                   <AdminUploadModal modelKey={activeModel.name.toLowerCase()}/>
                )
            }

            {
                tab !== 'admin' && (
                    <div ref={signatureRef}>
                        <table>
                            <tbody>
                            <tr>
                                <td style={{borderRadius: 10}}>
                                    <table
                                        cellPadding="0"
                                        cellSpacing="0"
                                        bgcolor={activeModel.primaryColor}
                                        style={{
                                            fontFamily: 'Arial, sans-serif',
                                            fontSize: 14,
                                            color: '#fff',
                                            backgroundColor: activeModel.primaryColor,
                                            borderRadius: 10,
                                            width: width,
                                            height: height,
                                        }}
                                    >
                                        <tbody>
                                        <tr>
                                            <td style={{verticalAlign: 'top'}}>
                                                <table cellPadding="0" cellSpacing="0" style={{width: '100%'}}>
                                                    <tbody>
                                                    <tr>
                                                        <td style={{height: 0}}>
                                                            <table cellPadding="0" cellSpacing="0" style={{color: '#fff', width: '100%'}}>
                                                                <tbody>
                                                                <tr>
                                                                    <td style={{padding: '20px 0 0 25px'}}>
                                                                        <h1
                                                                            style={{
                                                                                margin: 0,
                                                                                fontFamily: 'Arial, sans-serif',
                                                                                textAlign: 'left',
                                                                                fontSize: 26,
                                                                            }}
                                                                        >
                                                                            {firstName && firstName !== '' ? firstName : 'Arthur'}
                                                                            {' '}
                                                                            {lastName && lastName !== '' ? ' ' + lastName : 'Mondon'}
                                                                        </h1>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{padding: '0 0 0 25px'}}>
                                                                        <h3
                                                                            style={{
                                                                                fontWeight: 'normal',
                                                                                margin: 0,
                                                                                marginTop: 8,
                                                                                fontFamily: 'Arial, sans-serif',
                                                                                textAlign: 'left',
                                                                                fontSize: 18,
                                                                                lineHeight: '18px',
                                                                            }}
                                                                        >
                                                                            {role && role !== '' ? role : 'Pôle expertise et développement'}
                                                                        </h3>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr style={{height: 0}}>

                                                        <td style={(mobile.trim() === '') ? {padding: '10px 0 20px 0'} : {padding: '10px 0 0 0'}}>
                                                            <table
                                                                cellPadding="0"
                                                                cellSpacing="0"
                                                                style={{width: '100%', textAlign: 'center'}}
                                                            >
                                                                <tbody>
                                                                <tr>
                                                                    <td style={{padding: '0 0 0 25px', width: 25}}>
                                                                        <img
                                                                            src={icons.phone}
                                                                            alt="Phone"
                                                                            width={22}
                                                                            height={22}
                                                                            style={{verticalAlign: 'middle'}}
                                                                        />
                                                                    </td>
                                                                    <td style={{textAlign: 'left', paddingTop: 3}}>
                                                                        <a
                                                                            href={`tel:${phone && phone !== '' ? phone : activeModel.phone.replace(/ /g, '')}`}
                                                                            style={{
                                                                                color: 'white',
                                                                                textDecoration: 'none',
                                                                                textAlign: 'left',
                                                                                fontFamily: 'Arial, sans-serif',
                                                                            }}
                                                                        >
                                                                            {phone && phone !== '' ? phone : activeModel.phone}
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    {(mobile && mobile.trim() !== '') && (
                                                        <tr>
                                                            <td style={{padding: '5px 0 20px 0'}}>
                                                                <table cellPadding="0" cellSpacing="0" style={{color: '#fff'}}>
                                                                    <tbody>
                                                                    <tr>
                                                                        <td style={{padding: '0 0 0 25px', width: 25}}>
                                                                            <img
                                                                                width={22}
                                                                                height={22}
                                                                                src={icons.tel}
                                                                                style={{verticalAlign: 'middle'}}
                                                                                alt="tel"
                                                                            />
                                                                        </td>
                                                                        <td style={{textAlign: 'left', paddingTop: 0}}>
                                                                            <a
                                                                                href={`tel:${mobile.replace(/ /g, '')}`}
                                                                                style={{
                                                                                    color: 'white',
                                                                                    textDecoration: 'none',
                                                                                    fontFamily: 'Arial, sans-serif',
                                                                                }}
                                                                            >
                                                                                {mobile}
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    )}

                                                    <tr>

                                                    </tr>

                                                    </tbody>
                                                </table>
                                            </td>
                                            {showAdditionalContent && (
                                                <td style={{width: 0}}>
                                                    <table style={{width: 320, height: 180, marginLeft: 'auto'}}>
                                                        <tbody>
                                                        <tr>
                                                            <td style={{width: '100%', height: '100%', padding: "25px", textAlign: 'center', overflow: 'hidden'}} valign="middle">
                                                                <img
                                                                    src={`${additionalContent.includes('base64') ? additionalContent : `data:image/png;base64,${additionalContent}`}`}
                                                                    alt="Signature Arthur Mondon"
                                                                    width={320}
                                                                    height={180}
                                                                    style={{objectFit: 'cover', border: 0, verticalAlign: 'middle', borderRadius: 10}}/>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            )}
                                        </tr>

                                        <tr style={{verticalAlign: 'bottom'}}>
                                            <td colSpan={2}>
                                                <table
                                                    cellPadding="0"
                                                    cellSpacing="0"
                                                    bgcolor={activeModel.secondaryColor}
                                                    style={{
                                                        fontFamily: 'Arial, sans-serif',
                                                        fontSize: 14,
                                                        padding: '15px 0 15px 15px',
                                                        color: '#000',
                                                        backgroundColor: activeModel.secondaryColor,
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: 10,
                                                    }}
                                                >
                                                    <tbody>
                                                    <tr style={{verticalAlign: 'middle'}}>
                                                        <td style={{textAlign: 'left', paddingLeft: 15,}}>
                                                            <a href={activeModel.website} target="_blank">
                                                                <img
                                                                    src={activeModel.logo.src}
                                                                    style={{verticalAlign: 'middle', display:'block'}}
                                                                    width={activeModel.logo.width}
                                                                    height={activeModel.logo.height}
                                                                    alt={activeModel.name}
                                                                />
                                                            </a>
                                                        </td>
                                                        <td style={(!showSocialNetworks) ? {paddingRight: 15, border:0} : {paddingRight: 10, border:0}} width={"100%"}>
                                                            <table style={{width: '100%', border:0}} bgcolor={activeModel.secondaryColor}>
                                                                <tbody>
                                                                <tr>
                                                                    <td style={{textAlign: 'right', padding: 0, border:0}}>
                                                                        <a
                                                                            href={activeModel.website}
                                                                            target="_blank"
                                                                            style={{
                                                                                color: activeModel.thirdColor,
                                                                                display:'block',
                                                                                textDecoration: 'none',
                                                                                fontSize: 14,
                                                                                lineHeight: '14px',
                                                                                fontFamily: 'Arial, sans-serif',
                                                                                verticalAlign: 'bottom',
                                                                                border:0,
                                                                                backgroundColor: activeModel.secondaryColor,
                                                                            }}
                                                                        >
                                                                            {activeModel.website}
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{textAlign: 'right', padding: 0}}>
                                                                        <a
                                                                            href={activeModel.secondaryWebsite}
                                                                            target="_blank"
                                                                            style={{
                                                                                color: activeModel.thirdColor,
                                                                                textDecoration: 'none',
                                                                                fontSize: 14,
                                                                                lineHeight: '14px',
                                                                                fontFamily: 'Arial, sans-serif',
                                                                                verticalAlign: 'top',
                                                                            }}
                                                                        >
                                                                            {activeModel.secondaryWebsite}
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                        {showSocialNetworks && (
                                                            <td style={{textAlign: 'right', verticalAlign: 'middle', paddingRight: 15}}>
                                                                <table style={{width: '100%', verticalAlign: 'middle'}}>
                                                                    <tbody>
                                                                    <tr>
                                                                        <td style={{textAlign: 'right'}}>
                                                                            <a
                                                                                href={activeModel.socialNetworks.facebook}
                                                                                target="_blank"
                                                                                style={{
                                                                                    textDecoration: 'none',
                                                                                    backgroundColor: activeModel.primaryColor,
                                                                                    width: 30,
                                                                                    height: 30,
                                                                                    display: 'block',
                                                                                    borderRadius: 4,
                                                                                    padding: 3,
                                                                                }}
                                                                                title="Facebook"
                                                                            >
                                                                                <img src={icons.facebook} width={30} height={30} alt="facebook"/>
                                                                            </a>
                                                                        </td>
                                                                        <td style={{textAlign: 'right'}}>
                                                                            <a
                                                                                href={activeModel.socialNetworks.linkedin}
                                                                                target="_blank"
                                                                                style={{
                                                                                    textDecoration: 'none',
                                                                                    backgroundColor: activeModel.primaryColor,
                                                                                    width: 30,
                                                                                    height: 30,
                                                                                    display: 'block',
                                                                                    borderRadius: 4,
                                                                                    padding: 3,
                                                                                }}
                                                                                title="LinkedIn"
                                                                            >
                                                                                <img src={icons.linkedin} width={30} height={30} alt="linkedin"/>
                                                                            </a>
                                                                        </td>
                                                                        <td style={{textAlign: 'right'}}>
                                                                            <a
                                                                                href={activeModel.socialNetworks.youtube}
                                                                                target="_blank"
                                                                                style={{
                                                                                    textDecoration: 'none',
                                                                                    backgroundColor: activeModel.primaryColor,
                                                                                    width: 30,
                                                                                    height: 30,
                                                                                    display: 'block',
                                                                                    borderRadius: 4,
                                                                                    padding: 3,
                                                                                }}
                                                                                title="YouTube"
                                                                            >
                                                                                <img src={icons.youtube} width={30} height={30} alt="youtube"/>
                                                                            </a>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        )}
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div>
    );
}

export default App;
