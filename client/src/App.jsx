import {useEffect, useRef, useState} from 'react'
import './App.css'
import { icons } from './assets/icons.js';

function App() {
    const signatureRef = useRef(null);

    const [width, setWidth] = useState(600);
    const [height, setHeight] = useState(235);
    const [showSocialNetworks, setShowSocialNetworks] = useState(false);
    const [pseudo, setPseudo] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');

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
        } else {
            setWidth(450);
        }
    }

    const updateHeight = () => {
        if (mobile === '') {
            setHeight(200);
        } else {
            setHeight(235);
        }
    }

    useEffect(() => {

        updateHeight();
        updateWidth();
    }, [showSocialNetworks, mobile]);

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <h1>Signature Preview</h1>

            <form>
                <label>
                    Afficher les réseaux sociaux
                    <input
                        type="checkbox"
                        checked={showSocialNetworks}
                        onChange={() => setShowSocialNetworks(!showSocialNetworks)}
                    />
                </label>
                <br/>

                <label>
                    Pseudo
                    <input
                        type="text"
                        required
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                        placeholder="amo01"
                        style={{marginLeft: '10px', marginBottom: '10px'}}
                        maxLength={20}
                    />
                </label>
                <br/>
                <label>
                    Prénom
                    <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Arthur"
                        style={{marginLeft: '10px', marginBottom: '10px'}}
                        maxLength={20}
                    />
                </label>
                <br/>
                <label>
                    Nom
                    <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Mondon"
                        style={{marginLeft: '10px', marginBottom: '10px'}}
                        maxLength={20}
                    />
                </label>
                <br/>
                <label>
                    Fonction
                    <input
                        type="text"
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Pôle expertise et développement"
                        style={{marginLeft: '10px', marginBottom: '10px'}}
                        maxLength={45}
                    />
                </label>
                <br/>
                <label>
                    Téléphone
                    <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+33 4 90 65 65 86"
                        style={{marginLeft: '10px', marginBottom: '10px'}}
                        maxLength={20}
                    />
                </label>
                <br/>
                <label>
                    Mobile
                    <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="+33 6 78 91 01 12"
                        style={{marginLeft: '10px', marginBottom: '10px'}}
                        maxLength={20}
                    />
                </label>
            </form>

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
                        <td>
                            <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                                <tbody>
                                <tr>
                                    <td>
                                        <table cellPadding="0" cellSpacing="0" style={{ color: '#fff', width: '100%' }}>
                                            <tbody>
                                            <tr>
                                                <td style={{ padding: '20px 0 0 25px' }}>
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
                                                <td style={{ padding: '0 0 0 25px' }}>
                                                    <h3
                                                        style={{
                                                            fontWeight: 'normal',
                                                            margin: 0,
                                                            marginTop: 4,
                                                            fontFamily: 'Arial, sans-serif',
                                                            textAlign: 'left',
                                                            fontSize: 18,
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
                                <tr>

                                    <td style={(mobile === '') ? {padding: '0 0 20px 0'} : {}}>
                                        <table
                                            cellPadding="0"
                                            cellSpacing="0"
                                            style={{width: '100%', marginTop: 10, textAlign: 'center'}}
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
                                {(mobile && mobile !== '') && (
                                    <tr>
                                        <td style={{padding: '0 0 20px 0'}}>
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
                                </tbody>
                            </table>
                        </td>
                    </tr>

                    <tr style={{verticalAlign: 'bottom'}}>
                        <td>
                            <table
                                cellPadding="0"
                                cellSpacing="0"
                                style={{
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: 14,
                                    padding: 15,
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
                                    <td style={{paddingLeft: 25}}>
                                        <table style={(!showSocialNetworks) ? {paddingRight: '10px',width: '100%'} : {width: '100%'}}>
                                            <tbody>
                                            <tr>
                                                <td style={{ textAlign: 'right', padding: 0 }}>
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
                                                <td style={{ textAlign: 'right', padding: 0 }}>
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
                                        <td style={{ paddingLeft: 15, textAlign: 'right', verticalAlign: 'middle' }}>
                                            <table style={{ width: '100%', verticalAlign: 'middle' }}>
                                                <tbody>
                                                <tr>
                                                    <td style={{ textAlign: 'right' }}>
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
                                                            <img src={icons.facebook} style={{ width: 30 }} alt="facebook" />
                                                        </a>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
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
                                                            <img src={icons.linkedin} style={{ width: 30 }} alt="linkedin" />
                                                        </a>
                                                    </td>
                                                    <td style={{ textAlign: 'right' }}>
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
                                                            <img src={icons.youtube} style={{ width: 30 }} alt="youtube" />
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

            <button
                onClick={handleCopy}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                }}
            >
                📋 Copier la signature
            </button>
        </div>
    );
}

export default App;
