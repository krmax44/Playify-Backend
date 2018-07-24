const getToken = require('./getToken');

const tokenRenewer = () => {
    return getToken.renew()
        .then(data => {
            setTimeout(tokenRenewer, data.expiresIn * 1000 - 20000) // add some spare time
        })
        .catch(err => {
            console.error(err);
            setTimeout(tokenRenewer, 5000); // wait a bit, then try again
        });
};

module.exports = tokenRenewer;