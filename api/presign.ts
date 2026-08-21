import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Support CORS for local dev if needed
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { filename, contentType } = req.body || {};

    if (!filename || !contentType) {
      return res.status(400).json({ error: "filename and contentType are required" });
    }

    const bucketName = process.env.S3_BUCKET_NAME || "ecommerce-ft75-images";
    const region = process.env.AWS_REGION || "us-east-2";

    // Clean filename and create unique key
    const cleanFileName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `products/${Date.now()}-${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    // 5 minutes expiry
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    return res.status(200).json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error: any) {
    console.error("Error generating presigned URL:", error);
    return res.status(500).json({
      error: "Error generating presigned URL",
      details: error?.message || "Unknown error",
    });
  }
}
