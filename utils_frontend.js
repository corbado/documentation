exports.canUsePasskeys = () => {
    return new Promise(function (resolve, reject) {
        if (window.PublicKeyCredential) {
            return window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then((available) => {
                resolve(available);
            }).catch(() => {
                resolve(false);
            })
        } else {
            return resolve(false);
        }
    })
};