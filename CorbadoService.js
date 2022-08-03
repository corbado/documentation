const axios = require("axios");

class CorbadoService {
    clientInfo = () => {};

    /**
        Sign up
     */

    // @Route("/api/signup/webauthn/init")
    webAuthnRegisterStart = (username) => {
        return axios.post(proces.env.API_URL + 'webauthn/register/start', {username, origin: process.env.ORIGIN, clientInfo: clientInfo()});
    };

    // @Route("/api/signup/webauthn/finish")
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

        let response = {
            httpStatusCode: res.data.httpStatusCode,
            message: res.data.message,
        };

        return response;
    };

    emailLinkValidate = async (emailLinkID, token) => {
        try {
            let res = await axios.put(process.env.API_URL + "emailLinks/" + emailLinkID + "/validate", {token});

            let response = {
                httpStatusCode: res.data.httpStatusCode,
                message: res.data.message,
                additionalPayload: res.data.additionalPayload,
            };

            return response;
        } catch (e) {
            console.log(e)
        }
    }

    async confirmUser() {
        let response = await emailLinkValidate(emailLinkId, token);
        let { credentialId } = JSON.parse(response.additionalPayload);
        webAuthnConfirmDevice(credentialId, 'active');
    }

    webAuthnConfirmDevice = (credentialId, status) => {
        return axios.put(process.env.API_URL + `webauthn/credential/${credentialId}`, {status});
    };


    /**
        Login
     */

    // @Route("/api/login/webauthn/start")
    webAuthnLoginStart = (username) => {
        return axios.post(process.env.API_URL + 'webauthn/authenticate/start', {username, origin: process.env.ORIGIN, clientInfo: clientInfo()})
    };

    // @Route("/api/login/webauthn/finish")
    webAuthnLoginFinish = (publicKeyCredential) => {
        let data = {
            publicKeyCredential: JSON.stringify(publicKeyCredential),
            origin: process.env.ORIGIN,
            clientInfo: clientInfo(),
        };

        return axios.post(process.env.API_URL + 'webauthn/authenticate/finish', data);
    };
}