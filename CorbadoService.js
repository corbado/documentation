const axios = require("axios");
const {getClientInfo} = require('./utils_backend');

class CorbadoService {

    /**
     Sign up
     */


    /* Initialization phase */

    // @Route("/api/signup/webauthn/init")
    startSignup = (username, clientInfo) => {
        return axios.post(process.env.API_URL + 'webauthn/register/start', {
            username, origin: process.env.ORIGIN, clientInfo: clientInfo
        });
    };


    /* Finalization phase */

    // @Route("/api/signup/webauthn/finish")
    finishSignup = async (publicKeyCredential, clientInfo) => {
        let {data} = await this.webAuthnRegisterFinish(publicKeyCredential, clientInfo);
        return this.webAuthnConfirmDevice(data.credentialID, 'active');
    }

    webAuthnRegisterFinish = async (publicKeyCredential, clientInfo) => {
        let data = {
            publicKeyCredential: JSON.stringify(publicKeyCredential),
            origin: process.env.ORIGIN,
            clientInfo: clientInfo(),
        };

        return axios.post(process.env.API_URL + 'webauthn/register/finish', data)
    };

    webAuthnConfirmDevice = (credentialID, status) => {
        return axios.put(process.env.API_URL + `webauthn/credential/${credentialID}`, {status});
    };


    /**
     Login
     */

    /* Initialization phase */

    // @Route("/api/login/webauthn/start")
    startLogin = (username, clientInfo) => {
        return axios.post(process.env.API_URL + 'webauthn/authenticate/start', {
            username, origin: process.env.ORIGIN, clientInfo: clientInfo
        });
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