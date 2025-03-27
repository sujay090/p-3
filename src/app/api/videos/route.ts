import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Video, { IVideo } from "../../../../models/Video.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { transform } from "next/dist/build/swc/generated-native";
export async function GET() {
  try {
    await dbConnect();
    const Videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!Videos || Videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(Videos, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const body: IVideo = await req.json();
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "missing required fields" },
        { status: 400 }
      );
    }
    const video = {
      ...body,
      userId: session.user.id,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };
   const newVideo = await Video.create(video);
    return NextResponse.json(newVideo, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
