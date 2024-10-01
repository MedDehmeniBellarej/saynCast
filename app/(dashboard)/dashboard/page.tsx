"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getTvs } from "@/actions/GetTvs"; // Adjust the import path according to your project structure
import TVCard from "@/components/tvs/TVCard"; // Adjust the import path according to your project structure
import AddTvModal from "@/components/tvs/AddTvModal"; // Adjust the import path according to your project structure
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TV {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  music: string | null;
  ticker: string | null;
  documents: any[];
  displayedImage: string;
}

export default function Page() {
  const [tvs, setTvs] = useState<TV[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  const pageSize = 10; // Example page size

  const fetchTvs = async (page: number) => {
    const result = await getTvs(page, pageSize);
    if (result.error) {
      setError(result.error);
    } else {
      setTvs(result.tvs);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
    }
  };

  useEffect(() => {
    fetchTvs(currentPage);
  }, [currentPage]);

  const handleEdit = (tv: TV) => {
    // Handle edit TV logic here
    router.push(`/dashboard/Tv/${tv.name}?id=${tv.id}`);

    console.log('Edit TV:', tv);
  };

  const handleShow = (tv: TV) => {
    // Handle show TV logic here
    console.log('Show TV:', tv);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddTv = (newTv: { name: string; password: string }) => {
    // Add TV logic here
    console.log('Add TV:', newTv);
  };

  // Filter TVs based on search term
  const filteredTvs = tvs.filter(tv => tv.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-full p-4 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <AddTvModal onAdd={handleAddTv} />
        <input
          type="text"
          placeholder="Search TV..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded ml-auto"
        />
      </div>
      <ScrollArea className="h-full mb-4">
        {error ? (
          <p>{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {filteredTvs.map(tv => (
              <TVCard key={tv.id} tv={tv} onEdit={handleEdit} onShow={handleShow} />
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
