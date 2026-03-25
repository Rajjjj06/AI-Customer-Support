import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3client } from "../config/s3.js";

export const generateUrl = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    });
    const url = await getSignedUrl(s3client, command, {
      expiresIn: 60 * 60,
    });
    return url;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFile = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    });
    await s3client.send(command);
  } catch (error) {
    console.log(error);
  }
};
