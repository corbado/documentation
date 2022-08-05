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
            clientInfo: clientInfo
        });
        return data["publicKeyCredentialCreationOptions"];
    };


    /* Finalization phase */

    // @Route("/api/signup/webauthn/finish")
    finishSignup = async (publicKeyCredential, clientInfo) => {
        let {data} = await this.webAuthnRegisterFinish(publicKeyCredential, clientInfo);
        return this.webAuthnConfirmDevice(data["credentialID"], 'active');
    }

    webAuthnRegisterFinish = async (publicKeyCredential, clientInfo) => {
        let data = {
            publicKeyCredential: JSON.stringify(publicKeyCredential),
            origin: process.env.ORIGIN,
            clientInfo: clientInfo(),
        };

        return axios.post(process.env.API_URL + 'webauthn/register/finish', data)
    };

    webAuthnConfirmDevice = async (credentialID, status) => {
        return axios.put(process.env.API_URL + `webauthn/credential/${credentialID}`, {status});
    };


    /**
     Login
     */

    /* Initialization phase */

    // @Route("/api/login/webauthn/start")
    startLogin = async (username, clientInfo) => {
        let {data} = await axios.post(process.env.API_URL + 'webauthn/authenticate/start', {
            username, origin: process.env.ORIGIN, clientInfo: clientInfo
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

        return axios.post(process.env.API_URL + 'webauthn/authenticate/finish', data);
    };
}