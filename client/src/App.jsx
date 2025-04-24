import { useRef } from 'react'
import './App.css'

function App() {
    const signatureRef = useRef(null);

    const signatureHTML = `
  <head>
    <meta http-equiv="Content-Type"  content="text/html charset=UTF-8" />
    <title>Signature</title>
</head>

<table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #fff;background-color:#00AE5E; border-radius:10px">
    <tr>
        <td>
            <table cellpadding="0" cellspacing="0" style="padding: 25px;">
                <tr>
                    <td>
                        <table cellpadding="0" cellspacing="0" style="color: #fff">
                            <tr>
                                <td>
                                    <h1 style="margin:0;font-family: Arial, sans-serif;">Arthur Mondon</h1>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h3 style="font-weight: normal;margin-top: 4px;font-family: Arial, sans-serif;text-align: left;">Pôle expertise et développement</h3>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td>
                        <table cellpadding="0" cellspacing="0">
                            <tr>
                                <td>
                                    <img src="elements/phone.png" style="width:22px" alt="phone">
                                </td>
                                <td style="padding-left: 7px">
                                    <a href="tel:+33490409186" style="color: white; text-decoration: none;font-family: Arial, sans-serif;">
                                        + 33 4 90 65 65 86
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table cellpadding="0" cellspacing="0" style="color: #fff; margin-top: 8px">
                            <tr>
                                <td style="width: 20px">
                                    <img src="elements/tel.png" style="width:22px" alt="tel">
                                </td>
                                <td style="padding-left: 7px">
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

    <tr>
        <td>
            <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; font-size: 14px; padding: 15px; color: #000;background-color:#006633; width: 100%; border-radius: 10px">
                <tr style="vertical-align: middle">
                    <td>
                         <img src="elements/edissyum.png" style="width:200px;height:32px;padding-left: 15px" alt="edissyum">
                    </td>
                    <td style="padding-left: 50px">
                        <table>
                            <tr>
                                <td style="text-align: right">
                                    <a href="https://edissyum.com/" target="_blank" style="color: #D2FBD0; text-decoration: none;font-size: 14px;line-height: 14px;font-family: Arial, sans-serif;">https://edissyum.com</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: right">
                                    <a href="https://open-capture.com/" target="_blank" style="color: #D2FBD0; text-decoration: none;font-size: 14px;line-height: 14px;font-family: Arial, sans-serif;">https://open-capture.com</a>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td style="padding-left: 25px;padding-top:8px">
                        <table>
                            <tr>
                                <td style="text-align: center">
                                    <a href="https://facebook.com/edissyum/" target="_blank" style="text-decoration: none;background-color: #00AE5E; width: 30px; height:30px;display: block;border-radius:4px;padding: 3px" title="Facebook">
                                        <img src="elements/facebook.png" style="width:30px" alt="facebook">
                                    </a>
                                </td>
                                <td style="text-align: right">
                                    <a href="https://linkedin.com/company/edissyum-consulting/" target="_blank" style="text-decoration: none;background-color: #00AE5E; width: 30px; height:30px;display: block;border-radius:4px;padding: 3px" title="LinkedIn">
                                        <img src="elements/linkedin.png" style="width:30px" alt="linkedin">
                                    </a>
                                </td>
                                <td style="text-align: right">
                                    <a href="https://youtube.com/channel/UCQh4DnAakzDXuMXtMK2BTpQ/" target="_blank" style="text-decoration: none;background-color: #00AE5E; width: 30px; height:30px;display: block;border-radius:4px;padding: 3px" title="YouTube">
                                       <img src="elements/youtube.png" style="width:30px" alt="youtube">
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
