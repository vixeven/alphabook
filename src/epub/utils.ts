import { XMLParser, XMLValidator } from "fast-xml-parser";
import { Unzipped } from "fflate";

export const getEntry = (unzipped: Unzipped, name: string) => {
  if (!unzipped[name]) {
    return null;
  }

  const label = "utf-8";
  const encorder = new TextDecoder(label);
  const content = encorder.decode(unzipped[name]);

  return content;
};

export const getParseEntry = (unzipped: Unzipped, name: string) => {
  const entry = getEntry(unzipped, name);

  if (!entry) {
    throw new Error(`Entry ${name} not found`);
  }

  return parseXmlFromBuffer(entry);
};

export const parseXmlFromBuffer = (content: string) => {
  const validity = XMLValidator.validate(content);
  if (validity !== true) {
    console.error({ validationError: validity.err });

    throw new Error("Invalid XML!");
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  return parser.parse(content);
};
