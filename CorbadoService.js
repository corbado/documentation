const axios = require("axios");
const {getClientInfo} = require('./utils_backend');

class CorbadoService {

    /**
     Sign up
     */


    /* Initialization phase */

    // @Route("/api/signup/webauthn/init")
    startSignup = (username) => {
        return axios.post(process.env.API_URL + 'webauthn/register/start', {
            username, origin: process.env.ORIGIN, clientInfo: clientInfo()
        });
    };


    /* Finalization phase */

    // @Route("/api/signup/webauthn/finish")
    finishSignup = async (publicKeyCredential) => {
        let {data} = await this.webAuthnRegisterFinish(publicKeyCredential);
        return this.emailLinkSend(data.username, 'webauthn_signup_user', process.env.REDIRECT,
            true, {credentialID: data.credentialID});
    }

    webAuthnRegisterFinish = async (publicKeyCredential) => {
        let data = {
            publicKeyCredential: JSON.stringify(publicKeyCredential),
            origin: process.env.ORIGIN,
            clientInfo: clientInfo(),
        };

        return axios.post(process.env.API_URL + 'webauthn/register/finish', data)
    };

    emailLinkSend = async (email, templateName, redirect, create, additionalPayload) => {
        let data = {
            email: email,
            templateName: templateName, // webauthn_signup_user
            redirect: process.env.ORIGIN + redirect,
            create: create, // true
            additionalPayload: JSON.stringify(additionalPayload)
        };

        let res = await axios.post(process.env.API_URL + "emailLinks", data)

        return {
            httpStatusCode: res.data.httpStatusCode, message: res.data.message,
        };
    };


    /* Confirmation phase */

    // @Route("process.env.REDIRECT")
    confirmSignup = async (emailLinkId, token) => {
        let response = await this.emailLinkValidate(emailLinkId, token);
        let {credentialId} = JSON.parse(response.additionalPayload);
        return this.webAuthnConfirmDevice(credentialId, 'active');
    }

    emailLinkValidate = async (emailLinkID, token) => {
        let res = await axios.put(process.env.API_URL + "emailLinks/" + emailLinkID + "/validate", {token});

        return {
            httpStatusCode: res.data.httpStatusCode,
            message: res.data.message,
            additionalPayload: res.data.additionalPayload,
        };
    }

    webAuthnConfirmDevice = (credentialID, status) => {
        return axios.put(process.env.API_URL + `webauthn/credential/${credentialID}`, {status});
    };


    /**
     Login
     */

    /* Initialization phase */

    // @Route("/api/login/webauthn/start")
    startLogin = (username) => {
        return axios.post(process.env.API_URL + 'webauthn/authenticate/start', {
            username, origin: process.env.ORIGIN, clientInfo: clientInfo()
        });
    };


    /* Finalization phase */

    // @Route("/api/login/webauthn/finish")
    finishLogin = (publicKeyCredential) => {
        let data = {
            publicKeyCredential: JSON.stringify(publicKeyCredential),
            origin: process.env.ORIGIN,
            clientInfo: clientInfo(),
        };

        return axios.post(process.env.API_URL + 'webauthn/authenticate/finish', data);
    };
}