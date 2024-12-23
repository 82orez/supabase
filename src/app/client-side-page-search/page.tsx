"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function ClientSideSearchPage() {
  // ? 검색창의 입력값 상태 관리.
  const [search, setSearch] = useState("");

  const supabase = createClient();

  const getUseQuery = useQuery({
    // * "getUseQuery"는 이 쿼리문의 기본 이름에 해당.
    // * search 는 useEffect 의 배열에 해당. => search 값이 변경 될 때마다 재-렌더링.
    queryKey: ["getUseQuery", search],
    // * queryFn 속성에는 실행할 비동기 함수를 할당 => promise 반환.
    queryFn: async () => {
      // ? name 필드에서 search 에 해당하는 값을 포함하는 값을 검색
      const { data } = await supabase.from("test").select("*").ilike("name", `%${search}%`);
      // * data 의 타입은 객체(object)를 요소로 갖는 배열(array) 형태.
      return data;
    },
  });

  // if (getUseQuery.isPending) return <p>Loading...</p>;
  if (getUseQuery.error) return <p>Error loading notes</p>;

  return (
    <div className={"flex flex-col gap-5"}>
      <div>This is a Client side - search Page!</div>
      <Link href={"/"}>Move to Home!</Link>

      {/* 검색창 추가 부분*/}
      <input type="text" className={"border-2"} placeholder={"검색어를 입력하세요."} value={search} onChange={(e) => setSearch(e.target.value)} />

      <p>아래는 useQuery 부분</p>
      {getUseQuery.data
        ? getUseQuery.data.map((el) => (
            <div key={el.id}>
              name: {el.name} age: {el.age}
            </div>
          ))
        : null}
    </div>
  );
}
