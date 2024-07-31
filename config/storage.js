const {Storage} = require('@google-cloud/storage')

const storage = new Storage({
    projectId: 'ecogreenpath2',
    keyFilename: 'serviceaccountkey.json'
})

module.exports = storage