import React from "react";
import { baseWEBUrl } from "../../config.js"

// Footer for all pages
export default class Footer extends React.Component {
    render() {
        return (
            <footer class="grid-container row">
                <div class="col-sm-12 text-center">
                    <a href={baseWEBUrl} target="_blank">TAXplan Canada</a>
                    <p>
                        19-4370 Steeles Avenue West, Suite 203<br/>
                        Woodbridge, ON, L4L 4Y4, Canada<br/>
                        1-855-610-PLAN<br/>
                        <a href="mailto:info@taxplancanada.ca" target="_blank">info@taxplancanada.ca</a>
                    </p>
                </div>
                <div id="footer-ssl-container">
                    <a href="https://instantssl.com/ssl.html">
                        <img id="footer-ssl-image" alt="SSL" src="https://www.instantssl.com/ssl-certificate-images/support/comodo_secure_100x85_transp.png"/>
                        <br/>
                        <span id="footer-ssl-text">SSL</span>
                    </a>
                </div>
            </footer>
        );
    }
}
