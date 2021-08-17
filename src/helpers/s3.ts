import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_ACCESS_KEY_SECRET;

const S3Client = new S3({ region, accessKeyId, secretAccessKey });

export const uploadFile = (file: any) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return S3Client.upload(uploadParams).promise();
};


export const getFileStream = (fileKey: any) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return S3Client.getObject(downloadParams).createReadStream();
};
