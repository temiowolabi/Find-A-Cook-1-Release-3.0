require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.S3_BUCKET_REGION
const accessKeyId = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
  })
  
  
  // uploads a file to s3
  function uploadFile(file, folderName) {
    const fileStream = fs.createReadStream(file.path)
  
    const uploadParams = {
      Bucket: bucketName,
      Body: fileStream,
      Key: `${folderName}/${file.filename}`
    }
  
    return s3.upload(uploadParams).promise()
  }
  function uploadToS3(file, folderName, cook_id) {
    if (!file || !file.originalname) {
      throw new Error('File not provided');
    }
  
    // Setting up S3 upload parameters
    const params = {
      Bucket: bucketName,
      Key: `${folderName}/${cook_id}-${file.originalname}`,
      Body: file.buffer,
      Metadata: {
        cook_id: cook_id, // add cookId as metadata
      },
    };
  
    // Uploading files to the bucket
    return s3.upload(params).promise();
  }
  

  
  exports.uploadFile = uploadFile
  exports.uploadToS3 = uploadToS3
  
  
  // downloads a file from s3
  function getFileStream(fileKey) {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName
    }
  
    return s3.getObject(downloadParams).createReadStream()
  }
  exports.getFileStream = getFileStream