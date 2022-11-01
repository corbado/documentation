const axios = require("axios");

class CorbadoService {

    /**
     Sign up
     */

    /* Initialization phase */

    // @Route("/api/signup/webauthn/init")
    startSignup = async (username, clientInfo) => {
        let {data} = await axios.post(process.env.API_URL + 'webauthn/register/start', {
            username,
            origin: process.env.ORIGIN,
            clientInfo: clientInfo,
            credentialStatus: "active"
        }, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.PROJECT_ID}:${process.env.API_SECRET}`).toString('base64')
            }
        });
        return data["publicKeyCredentialCreationOptions"];
    };


    /* Finalization phase */

    // @Route("/api/signup/webauthn/finish")
    finishSignup = async (publicKeyCredential, clientInfo) => {
        let data = {
            publicKeyCredential: JSON.stringify(publicKeyCredential),
            origin: process.env.ORIGIN,
            clientInfo: clientInfo(),
        };

        return axios.post(process.env.API_URL + 'webauthn/register/finish', data, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.PROJECT_ID}:${process.env.API_SECRET}`).toString('base64')
            }
        });
    }


    /**
     Login
     */

    /* Initialization phase */

    // @Route("/api/login/webauthn/start")
    startLogin = async (username, clientInfo) => {
        let {data} = await axios.post(process.env.API_URL + 'webauthn/authenticate/start', {
            username, origin: process.env.ORIGIN, clientInfo: clientInfo
        }, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.PROJECT_ID}:${process.env.API_SECRET}`).toString('base64')
            }
        });
        return data['publicKeyCredentialRequestOptions'];
    };


    /* Finalization phase */

    // @Route("/api/login/webauthn/finish")
    finishLogin = (publicKeyCredential, clientInfo) => {
        let data = {
            publicKeyCredential: JSON.stringify(publicKeyCredential),
            origin: process.env.ORIGIN,
            clientInfo: clientInfo,
        };

        return axios.post(process.env.API_URL + 'webauthn/authenticate/finish', data, {
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${process.env.PROJECT_ID}:${process.env.API_SECRET}`).toString('base64')
            }
        });
    };
}

module.exports = new CorbadoService();
