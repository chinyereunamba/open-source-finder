"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import EnhancedSearch from "@/components/custom/enhanced-search";

export default function SearchBarHome() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/projects?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/projects");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  return (
    <div className="flex justify-between gap-2">
      <div className="flex-1">
        <EnhancedSearch
          value={searchInput}
          onChange={handleSearchChange}
          onSearch={handleSearch}
          placeholder="Search projects by name, language, or topic..."
          className="text-lg"
        />
      </div>
      <Button
        onClick={() => handleSearch(searchInput)}
        size="lg"
        className="h-11"
      >
        Search
      </Button>
    </div>
  );
}
