import { NextRequest, NextResponse } from "next/server";
import {
  DeleteObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/r2";

export const GET = async () => {
  const params = new ListObjectsCommand({
    Bucket: "gawwe",
  });
  const response = await s3Client.send(params);
  const data = response.Contents;

  return NextResponse.json(data, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const file: File = formData.get("file") as File;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const params = new PutObjectCommand({
    Bucket: "gawwe",
    Key: file.name,
    Body: buffer,
  });

  try {
    const response = await s3Client.send(params);
    // console.log("RES Upload : ", response);

    return NextResponse.json(
      { data: response.ETag, message: "File upload succesfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.log("ERR Upload : ", err);

    return NextResponse.json(
      { message: "Failed to upload file!" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const formData = await req.formData();
  const file: File = formData.get("file") as File;
  const key = formData.get("filekey") as string;

  if (!key) {
    return NextResponse.json(
      { message: "File key is required!" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const deleteParams = new DeleteObjectCommand({
      Bucket: "gawwe",
      Key: key,
    });

    await s3Client.send(deleteParams);

    const uploadParams = new PutObjectCommand({
      Bucket: "gawwe",
      Key: file.name,
      Body: buffer,
    });

    const response = await s3Client.send(uploadParams);
    // console.log("RES Update : ", response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.log("ERR Update : ", error);
    return NextResponse.json(
      { message: "Failed to update file!" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("key") as string;

  try {
    const params = new DeleteObjectCommand({
      Bucket: "gawwe",
      Key: id,
    });

    const response = await s3Client.send(params);
    // console.log("RES Delete : ", response);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete file!" },
      { status: 500 }
    );
  }
};
