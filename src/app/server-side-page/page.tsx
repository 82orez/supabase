"use server";

import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function ServerSidePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("test").select("*");

  if (error) {
    console.error("Insert Error:", error.message);
  }
  console.log("data: ", data);

  return (
    <div className={"flex flex-col gap-5"}>
      <div>This is a Server-Side-Page!</div>
      <Link href={"/"}>Click - Move to Home</Link>

      <ul className={"w-1/2 border-2"}>
        {data
          ? data.map((el) => (
              <li key={el.id} className={"my-2"}>
                name: {el.name} age: {el.age}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
}
