"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/app/react-query-provider";

export default function ClientSidePage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const supabase = createClient();

  // * Supabase db 에 새로운 값을 insert 하기 위한 비동기 함수 정의. => client 컴포넌트에서도 가능.
  const insertValue = async () => {
    const { error } = await supabase.from("test").insert([{ name, age: parseInt(age) }]);
    if (error) {
      console.error("Insert Error:", error);
      alert(error.message);
      return;
    }
    console.log("Inserted Successfully!");
  };

  // ? 새로운 값을 insert 한 후, db 조회를 위한 useQuery.
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getUseQuery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("test").select("*");
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const insertMutation = useMutation({
    // * mutationFn 속성에는 promise 를 반환하는 비동기 함수를 할당.
    mutationFn: insertValue,
    // * mutationFn 이 실행에 성공하면 onSuccess, 실패하면 onError 실행.
    onSuccess: () => {
      setName("");
      setAge("");
      queryClient.invalidateQueries({ queryKey: ["getUseQuery"] });
    },
    onError: (error) => {
      console.error("Insert Error:", error);
    },
  });

  const delMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("test").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUseQuery"] });
    },
    onError: (error) => {
      console.error("Delete Error:", error);
    },
  });

  return (
    <div className={"flex flex-col gap-5"}>
      <div>ClientSidePage - Input & 결과 조회</div>
      <Link href={"/"}>Move to Home</Link>
      <div>
        <input type="text" className="border-2" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" className="border-2" placeholder="age" value={age} onChange={(e) => setAge(e.target.value)} />
        {/* button 의 onClick 속성에 insertMutation.mutate() 를 적용하여 useMutation 쿼리를 실행. */}
        <button
          className="border-2"
          onClick={() => {
            insertMutation.mutate();
          }}>
          Click
        </button>
      </div>

      <h2>Query Results:</h2>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading data.</p>}
      {data
        ? data.map((item) => (
            <div key={item.id} className={"flex max-w-sm justify-between gap-5"}>
              name: {item.name} age: {item.age}
              <button
                className={"border-2 p-1"}
                onClick={() => {
                  delMutation.mutate(item.id);
                }}>
                del
              </button>
            </div>
          ))
        : null}
    </div>
  );
}
