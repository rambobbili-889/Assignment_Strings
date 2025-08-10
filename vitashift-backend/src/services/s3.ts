import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env.js';

export async function presignS3Put(objectKey: string, contentType: string, expiresSeconds = 900) {
  if (!env.awsRegion || !env.s3Bucket) return null;
  const client = new S3Client({ region: env.awsRegion });
  const cmd = new PutObjectCommand({ Bucket: env.s3Bucket, Key: objectKey, ContentType: contentType });
  const url = await getSignedUrl(client, cmd, { expiresIn: expiresSeconds });
  return { url, bucket: env.s3Bucket, key: objectKey, expiresIn: expiresSeconds };
}