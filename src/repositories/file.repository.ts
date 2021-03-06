import * as AWS from 'aws-sdk';
import cryptoRandomString from 'crypto-random-string';

export class FileRepository {
    static uploadFile(file: any): Promise<AWS.S3.ManagedUpload.SendData> {
        return new Promise((resolve, reject) => {
            const s3Bucket = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION,
            });

            const orgNameArray = file.originalname.split('.');
            const filExt = orgNameArray[orgNameArray.length - 1];

            const param = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${cryptoRandomString({ length: 10 })}.${filExt}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            } as AWS.S3.Types.PutObjectRequest;

            s3Bucket.upload(param, async (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    }
}
