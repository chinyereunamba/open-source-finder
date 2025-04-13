import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const PaginationControls = ({ currentPage }: { currentPage: number }) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        className="cursor-pointer"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => router.push(`?page=${currentPage - 1}`)}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Previous
      </Button>
      {[...Array(currentPage + 2)].map((_, i) => {
        const pageNumber = i + 1;

        if (
          pageNumber === 1 ||
          Math.abs(currentPage - pageNumber) <= 1 ||
          pageNumber === currentPage + 2
        ) {
          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => router.push(`?page=${pageNumber}`)}
            >
              {pageNumber}
            </Button>
          );
        }

        if (pageNumber === currentPage - 2 || pageNumber === currentPage + 1) {
          return (
            <span key={pageNumber} className="px-2">
              ...
            </span>
          );
        }

        return null;
      })}

      <Button
        variant="outline"
        className="cursor-pointer"
        size="sm"
        onClick={() => router.push(`?page=${currentPage + 1}`)}
      >
        Next
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default PaginationControls;
