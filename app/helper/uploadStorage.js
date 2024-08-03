const storage = require('../../config/storage.js')

exports.uploadStorage = (file, res, next) => {
    // Create a new filename for the uploaded image
    const filename = `${Date.now()}_${file.originalname}`
    const bucketName = 'photo-egp'

    const bucket = storage.bucket(bucketName)
    // Upload the image to the GCS bucket
    const blob = bucket.file(filename)
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: file.mimetype
        }
    })

    blobStream.on('error', (err) => {
        next
    })

    blobStream.on('finish', () => {
        const imageUrl = `https://storage.googleapis.com/${bucketName}/${filename}`
        next(imageUrl)
    })

    blobStream.end(file.buffer)
}