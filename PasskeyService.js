import axios from "axios";
import {create, get} from "@github/webauthn-json";

class PasskeyService {
    signUp(email) {
        return axios.post('/api/signup/webauthn/start', {email})
            .then(async ({data}) => {
                let publicKeyCredential = await create(data);
                return axios.post('/api/signup/webauthn/finish', publicKeyCredential);
            });
    }

    login(email) {
        return axios.post('api/login/webauthn/start', {email})
            .then(async ({data}) => {
                let publicKeyCredential = await get(data);
                return axios.post('/api/login/webauthn/finish', publicKeyCredential);
            })
    }
}

export default new PasskeyService();