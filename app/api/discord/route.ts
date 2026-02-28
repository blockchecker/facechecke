export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get("image") as File;
  const payload = formData.get("payload") as string;

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL!;

  const discordForm = new FormData();
  discordForm.append("payload_json", payload);

  if (image) {
    discordForm.append("file", image);
  }

  await fetch(webhookUrl, {
    method: "POST",
    body: discordForm,
  });

  return NextResponse.json({ ok: true });
}
