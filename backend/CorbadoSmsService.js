const axios = require("axios");

class CorbadoSmsService {

    /**
     Initialization
     */

    // @Route("/api/smsCodeSend")
    smsCodeSend = async (phoneNumber, create) => {
        let data = {
            phoneNumber: phoneNumber,
            create: create,
        };

        let res = await axios.post(process.env.API_URL + "smsCodes", data)

        return {
            httpStatusCode: res.data.httpStatusCode,
            message: res.data.message,
            smsCodeID: res.data.data.smsCodeID
        };
    };


    /**
     Finalization
     */

    // @Route("/api/smsCodeValidate/{smsCodeID}
    smsCodeValidate = async (smsCodeID, smsCode) => {
        let res = await axios.put(process.env.API_URL + "smsCodes/" + smsCodeID + "/validate", {smsCode});

        return {
            httpStatusCode: res.data.httpStatusCode,
            message: res.data.message,
        };
    }
}

module.exports = new CorbadoSmsService();