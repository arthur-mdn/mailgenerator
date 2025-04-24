import { useRef } from 'react'
import './App.css'
import { icons } from './assets/icons.js';

function App() {
    const signatureRef = useRef(null);

    const signatureHTML = `
  <head>
    <meta http-equiv="Content-Type"  content="text/html charset=UTF-8" />
    <title>Signature</title>
</head>

<table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #fff;background-color:#00AE5E; border-radius:10px;width: 600px; height: 235px">
    <tr>
        <td>
            <table cellpadding="0" cellspacing="0" style="width: 100%">
                <tr>
                    <td>
                        <table cellpadding="0" cellspacing="0" style="color: #fff; width: 100%;">
                            <tr>
                                <td style="padding: 20px 0 0 25px;">
                                    <h1 style="margin:0;font-family: Arial, sans-serif;text-align: left;font-size: 26px;">Arthur Mondon</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0 0 0 25px;">
                                    <h3 style="font-weight: normal;margin:0;margin-top: 4px;font-family: Arial, sans-serif;text-align: left;font-size: 18px;">Pôle expertise et développement</h3>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td>
                        <table cellpadding="0" cellspacing="0" style="width: 100%;margin-top:10px;text-align: center">
                            <tr>
                                <td style="padding: 0 0 0 25px;width: 25px">
                                    <img src=${icons.phone} alt="Phone" style="width:22px; vertical-align: middle;" />
                                </td>
                                <td style="text-align: left;padding-top: 3px">
                                    <a href="tel:+33490409186" style="color: white; text-decoration: none;text-align: left;font-family: Arial, sans-serif;">
                                        + 33 4 90 65 65 86
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 0 20px 0;">
                        <table cellpadding="0" cellspacing="0" style="color: #fff;">
                            <tr>
                                <td style="padding: 0 0 0 25px; width: 25px">
                                    <img src=${icons.tel} style="width:22px; vertical-align: middle;" alt="tel">
                                </td>
                                <td style="text-align: left;padding-top: 3px;">
                                    <a href="tel:+33490409186" style="color: white; text-decoration: none;font-family: Arial, sans-serif;">
                                        + 33 6 78 91 01 12
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <tr style="vertical-align: bottom;">
        <td>
            <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; font-size: 14px; padding: 15px; color: #000;background-color:#006633; width: 100%; height:100%;border-radius: 10px">
                <tr style="vertical-align: middle">
                    <td style="text-align: left;">
                        <a href="https://edissyum.com/" target="_blank">
                            <img src=${icons.edissyum} style="width:200px;height:32px;padding-left: 15px; vertical-align: middle" alt="edissyum">
                        </a>
                    </td>
                    <td style="padding-left: 25px">
                        <table style="width: 100%;">
                            <tr>
                                <td style="text-align: right;padding: 0">
                                    <a href="https://edissyum.com/" target="_blank" style="color: #D2FBD0; text-decoration: none;font-size: 14px;line-height: 14px;font-family: Arial, sans-serif;vertical-align: bottom;">https://edissyum.com</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: right;padding: 0;">
                                    <a href="https://open-capture.com/" target="_blank" style="color: #D2FBD0; text-decoration: none;font-size: 14px;line-height: 14px;font-family: Arial, sans-serif;vertical-align: top">https://open-capture.com</a>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td style="padding-left: 15px; text-align: right; vertical-align: middle">
                        <table style="width: 100%; vertical-align: middle">
                            <tr>
                                <td style="text-align: right;">
                                    <a href="https://facebook.com/edissyum/" target="_blank" style="text-decoration: none;background-color: #00AE5E; width: 30px; height:30px;display: block;border-radius:4px;padding: 3px" title="Facebook">
                                        <img src=${icons.facebook} style="width:30px" alt="facebook">
                                    </a>
                                </td>
                                <td style="text-align: right">
                                    <a href="https://linkedin.com/company/edissyum-consulting/" target="_blank" style="text-decoration: none;background-color: #00AE5E; width: 30px; height:30px;display: block;border-radius:4px;padding: 3px" title="LinkedIn">
                                        <img src=${icons.linkedin} style="width:30px" alt="linkedin">
                                    </a>
                                </td>
                                <td style="text-align: right">
                                    <a href="https://youtube.com/channel/UCQh4DnAakzDXuMXtMK2BTpQ/" target="_blank" style="text-decoration: none;background-color: #00AE5E; width: 30px; height:30px;display: block;border-radius:4px;padding: 3px" title="YouTube">
                                       <img src=${icons.youtube} style="width:30px" alt="youtube">
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <!--<img src="signature_files/edissyum-logo.png" alt="Signature Arthur Mondon" style="width: 218px; max-width: 100%; border: 0;"> -->
</table>

`;

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


    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <h1>Signature Preview</h1>

            <div
                ref={signatureRef}
                dangerouslySetInnerHTML={{ __html: signatureHTML }}
            >
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
    )
}

export default App
