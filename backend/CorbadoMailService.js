const axios = require("axios");

class CorbadoMailService {

    /**
     Initialization
     */

    // @Route("/api/emailLinkSend")
    emailLinkSend = async (email, templateName, redirect, create, additionalPayload) => {
        let data = {
            email: email,
            templateName: templateName,
            redirect: process.env.ORIGIN + redirect,
            create: create,
            additionalPayload: JSON.stringify(additionalPayload)
        };

        let res = await axios.post(process.env.API_URL + "emailLinks", data)

        return {
            httpStatusCode: res.data.httpStatusCode, message: res.data.message,
        };
    };


    /**
     Finalization
     */

    // @Route("/api/emailLinkValidate/{emailLinkID}")
    emailLinkValidate = async (emailLinkID, token) => {
        let res = await axios.put(process.env.API_URL + "emailLinks/" + emailLinkID + "/validate", {token});

        return {
            httpStatusCode: res.data.httpStatusCode,
            message: res.data.message,
            additionalPayload: res.data.additionalPayload,
        };
    }
}

module.exports = new CorbadoMailService();