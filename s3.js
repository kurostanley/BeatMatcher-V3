require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')
const multer = require('multer')
const multerS3 = require('multer-s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
  endpoint:"https://s3.eu-west-2.amazonaws.com",
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'beatmatcher-app',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      if (file.fieldname === 'avatar') {
        cb(null, `${file.fieldname}-${Date.now()}.jpg`);
      } else if (file.fieldname === 'music') {
        cb(null, `${file.fieldname}-${Date.now()}.mp3`);
      }
    }
  })
})

exports.upload = upload

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file[0].path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file[0].filename
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile


// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream