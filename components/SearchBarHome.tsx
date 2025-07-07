"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input } from "@/components/custom";
import { Search } from "lucide-react";

export default function SearchBarHome() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`/projects?search=${encodeURIComponent(searchInput)}`);
    } else {
      router.push("/projects");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      <div className="relative text-xl w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search projects..."
          className="w-full pl-8 sm:w-[300px] md:w-full text-xl"
          value={searchInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
