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
    <div className="flex justify-between gap-4">
      <div className="relative text-xl w-full">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
        <Input
          type="search"
          placeholder="Search projects by name, language, or topic..."
          className="w-full pl-14 pr-4 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 shadow-sm hover:shadow-md"
          value={searchInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        onClick={handleSearch}
        className="px-8 py-5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl"
      >
        Search
      </Button>
    </div>
  );
}
