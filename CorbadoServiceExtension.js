const axios = require("axios");

class CorbadoServiceExtension {

    /**
     Add multiple devices
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

    // @Route("/api/signup/webauthn/device/finish")
    finishSignupDevice = async (publicKeyCredential, clientInfo) => {
        let {data} = await this.webAuthnRegisterFinish(publicKeyCredential, clientInfo);
        return this.emailLinkSend(
            data["username"],
            'webauthn_signup_device',
            process.env.REDIRECT,
            true,
            {credentialID: data["credentialID"]});
    }

    webAuthnRegisterFinish = async (publicKeyCredential, clientInfo) => {
        let data = {
            publicKeyCredential: JSON.stringify(publicKeyCredential),
            origin: process.env.ORIGIN,
            clientInfo: clientInfo,
        };

        return axios.post(process.env.API_URL + 'webauthn/register/finish', data);
    };

    emailLinkSend = async (email, templateName, redirect, create, additionalPayload) => {
        let data = {
            email: email,
            templateName: templateName, // webauthn_signup_device
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


    /* Confirmation phase */

    // @Route("process.env.REDIRECT")
    confirmSignup = async (emailLinkId, token) => {
        let response = await this.emailLinkValidate(emailLinkId, token);
        let {credentialID} = JSON.parse(response.additionalPayload);
        return this.webAuthnConfirmDevice(credentialID, 'active');
    }

    emailLinkValidate = async (emailLinkID, token) => {
        let res = await axios.put(process.env.API_URL + "emailLinks/" + emailLinkID + "/validate", {token});

        let response = {
            httpStatusCode: res.data.httpStatusCode,
            message: res.data.message,
            additionalPayload: res.data.additionalPayload,
        };

        return response;
    }

    webAuthnConfirmDevice = (credentialID, status) => {
        return axios.put(process.env.API_URL + `webauthn/credential/${credentialID}`, {status});
    };
}

module.exports = new CorbadoServiceExtension();