type RootFileManifest = {
  id: string;
  items: Array<{
    fallback: string;
    href: string;
    id: string;
    mediaType: string;
    mediaOverlay: string;
    properties: string;
  }>;
};

/**
 * Parse the root file manifest
 *
 * @param {object} manifest - The root file manifest
 */
function parseRootFileManifest(manifest: any) {
  const items: Array<Record<string, string>> = manifest.item;

  const obj: RootFileManifest = {
    id: manifest.id,
    items: [],
  };

  for (const item of items) {
    obj.items.push({
      fallback: item["fallback"],
      href: item["href"],
      id: item["id"],
      mediaType: item["media-type"],
      mediaOverlay: item["media-overlay"],
      properties: item["properties"],
    });
  }

  return obj;
}

export default parseRootFileManifest;
