import {useEffect, useRef, useState} from 'react'
import './App.css'
import { icons } from './assets/icons.js';
import SelectAdditionalContent from "./components/SelectAdditionalContent.jsx";
import { FiSliders, FiShare, FiDownload, FiClipboard, FiCode } from 'react-icons/fi';
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { SiThunderbird } from "react-icons/si";

function ExportViaDownloadHTML({signatureRef, lastname, firstname}) {
    let pseudo = `${firstname} ${lastname}`;
    pseudo = pseudo.replace(/[^a-zA-Z0-9]/g, '_');
    if(!pseudo){
        pseudo = 'Signature';
    }
    else {
        pseudo = 'Signature_' + pseudo;
    }
    return (
        <a
            href={`data:text/html;charset=utf-8,${encodeURIComponent(signatureRef.current ? signatureRef.current.innerHTML : '')}`}
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
                value={signatureRef.current ? signatureRef.current.innerHTML : ''}
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

function App() {
    const signatureRef = useRef(null);
    const [tab, setTab] = useState('inputs');
    const [exportTab, setExportTab] = useState('thunderbird');

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

    return (
        <div style={{fontFamily: 'Arial, sans-serif', display:'flex', flexDirection:'column', gap:'1rem', alignItems:'center'}}>
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
            </div>

            {
                tab === 'inputs' && (
                    <form style={{backgroundColor: 'white', padding: '2rem', width: 450, borderRadius: '0.5rem', textAlign: 'left'}}>
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

                                        <SelectAdditionalContent onSelect={setBase64}/>
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
                                    placeholder="+33 4 90 65 65 86"
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
                    <div style={{backgroundColor: 'white', padding: '2rem', width: 450, borderRadius: '0.5rem', textAlign: 'left', display:'flex', flexDirection:'column', gap:'0.5rem'}}>

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
                                <div style={{display: 'flex', flexDirection:'column', gap: '0.5rem'}}>
                                    <h3>Thunderbird</h3>
                                    <p>Pour Thunderbird, cliquez sur le bouton ci-dessous.</p>

                                    <p>Téléchargez la signature au format HTML.</p>
                                    <ExportViaDownloadHTML signatureRef={signatureRef} firstname={firstName} lastname={lastName}/>
                                </div>
                            )
                        }

                        {
                            exportTab === 'outlook' && (
                                <div style={{display: 'flex', flexDirection:'column', gap: '0.5rem'}}>
                                    <h3>Outlook</h3>
                                    <p>Pour Outlook, cliquez sur le bouton ci-dessous.</p>
                                    <ExportViaCopy handleCopy={handleCopy}/>
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


            <div ref={signatureRef}>
                <table
                    cellPadding="0"
                    cellSpacing="0"
                    style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: 14,
                        color: '#fff',
                        backgroundColor: '#00AE5E',
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
                                                        style={{width: 22, verticalAlign: 'middle'}}
                                                    />
                                                </td>
                                                <td style={{textAlign: 'left', paddingTop: 3}}>
                                                    <a
                                                        href="tel:+33490409186"
                                                        style={{
                                                            color: 'white',
                                                            textDecoration: 'none',
                                                            textAlign: 'left',
                                                            fontFamily: 'Arial, sans-serif',
                                                        }}
                                                    >
                                                        {phone && phone !== '' ? phone : '+33 4 90 65 65 86'}
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
                                                            src={icons.tel}
                                                            style={{width: 22, verticalAlign: 'middle'}}
                                                            alt="tel"
                                                        />
                                                    </td>
                                                    <td style={{textAlign: 'left', paddingTop: 0}}>
                                                        <a
                                                            href="tel:+33490409186"
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
                            <td style={{width:0}}>
                                <table style={{width: 320, height: 180, marginLeft: 'auto'}}>
                                    <tbody>
                                        <tr>
                                            <td style={{width: '100%', height: '100%', padding: "25px", textAlign: 'center', overflow: 'hidden'}} valign="middle">
                                                <img
                                                    src={`${additionalContent.includes('base64') ? additionalContent : `data:image/png;base64,${additionalContent}`}`}
                                                    alt="Signature Arthur Mondon"
                                                    style={{width: '100%', height: '100%', objectFit: 'cover', border: 0, verticalAlign: 'middle', borderRadius: 10}}/>
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
                                style={{
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: 14,
                                    padding: '15px 0 15px 15px',
                                    color: '#000',
                                    backgroundColor: '#006633',
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: 10,
                                }}
                            >
                                <tbody>
                                <tr style={{verticalAlign: 'middle'}}>
                                    <td style={{textAlign: 'left'}}>
                                        <a href="https://edissyum.com/" target="_blank">
                                            <img
                                                src={icons.edissyum}
                                                style={{width: 200, height: 32, paddingLeft: 15, verticalAlign: 'middle'}}
                                                alt="edissyum"
                                            />
                                        </a>
                                    </td>
                                    <td style={(!showSocialNetworks) ? {paddingRight: 15, width: '100%'} : {paddingRight: 10, width: '100%'}}>
                                        <table style={{width: '100%'}}>
                                            <tbody>
                                            <tr>
                                                <td style={{textAlign: 'right', padding: 0}}>
                                                    <a
                                                        href="https://edissyum.com/"
                                                        target="_blank"
                                                        style={{
                                                            color: '#D2FBD0',
                                                            textDecoration: 'none',
                                                            fontSize: 14,
                                                            lineHeight: '14px',
                                                            fontFamily: 'Arial, sans-serif',
                                                            verticalAlign: 'bottom',
                                                        }}
                                                    >
                                                        https://edissyum.com
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style={{textAlign: 'right', padding: 0}}>
                                                    <a
                                                        href="https://open-capture.com/"
                                                        target="_blank"
                                                        style={{
                                                            color: '#D2FBD0',
                                                            textDecoration: 'none',
                                                            fontSize: 14,
                                                            lineHeight: '14px',
                                                            fontFamily: 'Arial, sans-serif',
                                                            verticalAlign: 'top',
                                                        }}
                                                    >
                                                        https://open-capture.com
                                                    </a>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    {showSocialNetworks && (
                                        <td style={{textAlign: 'right', verticalAlign: 'middle', paddingRight:15}}>
                                            <table style={{width: '100%', verticalAlign: 'middle'}}>
                                                <tbody>
                                                <tr>
                                                    <td style={{textAlign: 'right'}}>
                                                        <a
                                                            href="https://facebook.com/edissyum/"
                                                            target="_blank"
                                                            style={{
                                                                textDecoration: 'none',
                                                                backgroundColor: '#00AE5E',
                                                                width: 30,
                                                                height: 30,
                                                                display: 'block',
                                                                borderRadius: 4,
                                                                padding: 3,
                                                            }}
                                                            title="Facebook"
                                                        >
                                                            <img src={icons.facebook} style={{width: 30}} alt="facebook"/>
                                                        </a>
                                                    </td>
                                                    <td style={{textAlign: 'right'}}>
                                                        <a
                                                            href="https://linkedin.com/company/edissyum-consulting/"
                                                            target="_blank"
                                                            style={{
                                                                textDecoration: 'none',
                                                                backgroundColor: '#00AE5E',
                                                                width: 30,
                                                                height: 30,
                                                                display: 'block',
                                                                borderRadius: 4,
                                                                padding: 3,
                                                            }}
                                                            title="LinkedIn"
                                                        >
                                                            <img src={icons.linkedin} style={{width: 30}} alt="linkedin"/>
                                                        </a>
                                                    </td>
                                                    <td style={{textAlign: 'right'}}>
                                                        <a
                                                            href="https://youtube.com/channel/UCQh4DnAakzDXuMXtMK2BTpQ/"
                                                            target="_blank"
                                                            style={{
                                                                textDecoration: 'none',
                                                                backgroundColor: '#00AE5E',
                                                                width: 30,
                                                                height: 30,
                                                                display: 'block',
                                                                borderRadius: 4,
                                                                padding: 3,
                                                            }}
                                                            title="YouTube"
                                                        >
                                                            <img src={icons.youtube} style={{width: 30}} alt="youtube"/>
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
            </div>
        </div>
    );
}

export default App;
