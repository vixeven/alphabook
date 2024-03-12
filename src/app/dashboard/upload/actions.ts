"use server";

import parse from "@/epub/parse";

export const parseEpubFile = async (formData: FormData) => {
  const file = formData.get("file") as File;
  const fileBuf = Buffer.from(await file.arrayBuffer());
  const payload = parse(fileBuf);

  return payload;
};
