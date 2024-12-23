import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className={"flex flex-col gap-5"}>
      <div>Supabase's Home Page</div>
      <Link href={"/client-side-page-input"}>Move to Client-side-input page</Link>
      <Link href={"/client-side-page-search"}>Move to Client-side-search page</Link>
      <Link href={"/server-side-page"}>Move to Server-side page</Link>
    </div>
  );
}
