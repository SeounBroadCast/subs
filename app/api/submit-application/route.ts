import { connectToDB } from "@/lib/mongoose";
import ApplicationModel from "@/lib/models/Application";
import { NextRequest, NextResponse } from "next/server";

interface Application {
  name: string;
  studentNumber: string;
  applicationFileURL: string;
  fileType: string;
}

interface Validity {
  isValid: boolean;
  message: string;
}

async function addFileInfoToDB({
  name,
  studentNumber,
  applicationFileURL,
  fileType,
}: Application): Promise<Validity> {
  await connectToDB();
  const isValidDoc = JSON.parse(
    JSON.stringify(await ApplicationModel.findById("65e5a2deabca692f1f9590f9"))
  );
  if (!isValidDoc.isValid) {
    return { isValid: false, message: isValidDoc.message };
  }
  await ApplicationModel.findByIdAndUpdate(
    "65e5b27aabca692f1f9590fa",
    {
      $push: {
        applications: {
          name: name,
          studentNumber: studentNumber,
          applicationFileURL: applicationFileURL,
          fileType: fileType,
        },
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return { isValid: true, message: "" };
}

export async function POST(req: NextRequest) {
  const requestedData: Application = await req.json();
  const result = await addFileInfoToDB(requestedData);
  return NextResponse.json(result);
}
