import { getVersion } from "@/actions";

export default async function Home() {
  const version = await getVersion();

  return (
    <div className="p-2 flex flex-col gap-y-2">
      <h1 className="text-xl">It works!</h1>

      <code>MySQL Version: {version}</code>
    </div>
  );
}

export const runtime = "edge";
