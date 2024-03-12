"use client";

import { useState } from "react";
import {
  DropZone,
  FileDropItem,
  FileTrigger,
  Button,
  Text,
} from "react-aria-components";
import { parseEpubFile } from "./actions";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  return (
    <div className="p-10">
      <DropZone
        className="border p-5 mb-5"
        onDrop={async (e) => {
          const [file] = e.items.filter(
            (file) => file.kind === "file"
          ) as FileDropItem[];

          setFile(await file.getFile());
        }}
      >
        <FileTrigger
          acceptedFileTypes={["application/epub+zip"]}
          allowsMultiple={false}
          onSelect={(e) => {
            if (!e?.length) return;

            const [file] = Array.from(e);

            setFile(file);
          }}
        >
          <Button>Select files</Button>
        </FileTrigger>

        <Text slot="label" style={{ display: "block" }}>
          {file?.name || "Drop files here"}
        </Text>
      </DropZone>

      <Button
        onPress={async () => {
          if (!file) return;

          const formData = new FormData();
          formData.append("file", file);

          const values = await parseEpubFile(formData);
          setResult(values);
        }}
      >
        Parse
      </Button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export default Upload;
