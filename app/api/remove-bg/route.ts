import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || "4ioky3Gm6bcGic9QugKpKa99";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image_file") as File | null;
    const imageBase64 = formData.get("image_file_b64") as string | null;

    if (!imageFile && !imageBase64) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 }
      );
    }

    const apiFormData = new FormData();
    if (imageFile) {
      apiFormData.append("image_file", imageFile);
    } else if (imageBase64) {
      // Strip data:image/...;base64, prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      apiFormData.append("image_file_b64", cleanBase64);
    }
    apiFormData.append("size", "auto");

    const bgResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": REMOVE_BG_API_KEY,
      },
      body: apiFormData,
    });

    if (!bgResponse.ok) {
      let errDetail = "Remove.bg API Error";
      try {
        const errJson = await bgResponse.json();
        errDetail =
          errJson.errors?.[0]?.title ||
          errJson.errors?.[0]?.detail ||
          JSON.stringify(errJson);
      } catch {
        errDetail = await bgResponse.text();
      }
      return NextResponse.json(
        {
          success: false,
          error: errDetail,
          statusCode: bgResponse.status,
          fallbackRequired: true,
        },
        { status: 200 }
      );
    }

    const imageBuffer = await bgResponse.arrayBuffer();
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to process image",
        fallbackRequired: true,
      },
      { status: 200 }
    );
  }
}
