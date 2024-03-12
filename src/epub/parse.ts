import { unzipSync } from "fflate";

import parseRootFileManifest from "./manifest";
import parseRootFileRequiredMetadata from "./metadata";
import { getEntry, getParseEntry } from "./utils";

interface ParsedEpub {
  mimetype: string;
  opf: string[];
  epubVersion: string;
  metadata: any[];
  manifest: any[];
  isLegacy: boolean;
}

const parse = (buffer: Buffer): ParsedEpub => {
  const unzipped = unzipSync(new Uint8Array(buffer));

  const payload: ParsedEpub = {
    mimetype: "",
    opf: [],
    epubVersion: "",
    metadata: [],
    manifest: [],
    isLegacy: false,
  };

  const mimetype = getEntry(unzipped, "mimetype");

  if (mimetype) {
    if (mimetype === "application/epub+zip") {
      payload.mimetype = "application/epub+zip";
    } else {
      throw new Error("Incorrect mimetype");
    }
  } else {
    throw new Error("No mimetype file found");
  }

  const { container } = getParseEntry(unzipped, "META-INF/container.xml");

  Object.values(container.rootfiles).forEach((rootfile: any) => {
    let mime = rootfile["media-type"];
    let path = rootfile["full-path"];

    if (mime == "application/oebps-package+xml") {
      payload.opf.push(path);
    } else {
      throw new Error(
        "Incorrect mime type in container.xml may result in unknown parsing behaviour"
      );
    }
  });

  for (const rootfile of payload.opf) {
    const result = getParseEntry(unzipped, rootfile);

    payload.epubVersion = result.package.version;
    payload.isLegacy = parseInt(payload.epubVersion) < 3;

    payload.metadata.push(
      parseRootFileRequiredMetadata(result.package.metadata, {
        isLegacy: payload.isLegacy,
      })
    );

    payload.manifest.push(parseRootFileManifest(result.package.manifest));
  }

  return payload;
};

export default parse;
