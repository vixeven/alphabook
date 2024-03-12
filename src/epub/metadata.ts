interface MetadataOptions {
  isLegacy?: boolean;
}

function parseRootFileRequiredMetadata(
  metadata: Record<string, any>,
  options: MetadataOptions
): object {
  return {
    identifier: parseIdentifier(metadata["dc:identifier"]),
    title: parseTitle(metadata["dc:title"]),
    language: parseLanguage(metadata["dc:language"], options.isLegacy),
    dctermsModified: parseDctermsModified(metadata["meta"], options.isLegacy),
  };
}

function parseIdentifier(identifierMetadata: any[]) {
  if (!identifierMetadata) {
    throw new Error("Identifier metadata is missing.");
  }

  return identifierMetadata;
}

function parseTitle(titleMetadata: any[]) {
  if (!titleMetadata) {
    throw new Error("Title metadata is missing.");
  }

  return titleMetadata;
}

function parseLanguage(languageMetadata: string[], isLegacy?: boolean) {
  if (!languageMetadata) {
    throw new Error("Language metadata is missing.");
  }

  return languageMetadata;
}

function parseDctermsModified(
  modifiedMetadata: any[],
  isLegacy?: boolean
): string | null {
  if (!modifiedMetadata) {
    return null;
  }

  const modifiedDate = modifiedMetadata.find(
    (meta) => meta.property === "dcterms:modified"
  );

  if (!modifiedDate && !isLegacy) {
    throw new Error(
      "Dcterms:modified (last modified date) metadata is missing."
    );
  }

  return modifiedDate;
}

export default parseRootFileRequiredMetadata;
