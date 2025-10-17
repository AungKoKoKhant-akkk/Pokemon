import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Calculate which pages to show
    const getVisiblePages = () => {
        const delta = 2; // Number of pages to show on each side of current page
        const range = [];

        // Always show first page
        const showFirst = currentPage > delta + 2;
        const showLast = currentPage < totalPages - delta - 1;

        if (showFirst) {
            range.push(1);
            if (currentPage > delta + 3) {
                range.push('...');
            }
        }

        // Add pages around current page
        const start = Math.max(1, currentPage - delta);
        const end = Math.min(totalPages, currentPage + delta);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        if (showLast) {
            if (currentPage < totalPages - delta - 2) {
                range.push('...');
            }
            range.push(totalPages);
        }

        return range;
    };

    const visiblePages = getVisiblePages();

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination pagination-gradient justify-content-center">
                {/* Previous Page */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        title="Previous Page"
                    >
                        <i className="bi bi-caret-left-fill"></i>
                    </button>
                </li>

                {/* Page Numbers */}
                {visiblePages.map((page, index) => (
                    <li key={index} className={`page-item ${currentPage === page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                        {page === '...' ? (
                            <span className="page-link">...</span>
                        ) : (
                            <button
                                className="page-link"
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                {/* Next Page */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        title="Next Page"
                    >
                        <i className="bi bi-caret-right-fill"></i>
                    </button>
                </li>
            </ul>

            {/* Page Info */}
            <div className="text-center mt-2">
                <small className="text-muted">
                    Page {currentPage} of {totalPages}
                </small>
            </div>
        </nav>
    );
};

export default Pagination;