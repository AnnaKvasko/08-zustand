"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

export interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
  className,
}: PaginationProps) {
  
  const totalPages = Math.max(1, pageCount);
  const activePage = Math.max(0, currentPage - 1);

  return (
    <nav
      className={className}
      aria-label="Pagination navigation"
      role="navigation"
    >
      <ReactPaginate
        containerClassName={css.pagination}
        pageClassName={css.page}
        pageLinkClassName={css.pageLink}
        activeClassName={css.active}
        previousClassName={css.page}
        previousLinkClassName={css.pageLink}
        nextClassName={css.page}
        nextLinkClassName={css.pageLink}
        breakClassName={css.page}
        breakLinkClassName={css.pageLink}
        disabledClassName={css.disabled}
        previousLabel="‹ Prev"
        nextLabel="Next ›"
        breakLabel="…"
        pageCount={totalPages}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        forcePage={activePage}
        onPageChange={(event) => onPageChange(event.selected + 1)}
        renderOnZeroPageCount={null}
      />
    </nav>
  );
}
