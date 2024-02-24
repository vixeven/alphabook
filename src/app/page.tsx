import { getVersion } from "@/actions";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  const version = await getVersion();

  return (
    <div className="p-2 flex flex-col gap-y-2">
      <div className="flex justify-between w-full items-center">
        <h1 className="text-xl">It works!</h1>

        <UserButton />
      </div>

      <code>MySQL Version: {version}</code>
    </div>
  );
}

export const runtime = "edge";
