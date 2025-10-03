import React from 'react';



const Pagination = ({currentPage,totalPages,onPageChange}) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination pagination-gradient justify-content-center">
                <li className={`page-item ${currentPage ===1 ? 'disabled'  : ''}`}>
                    <button className="page-link" onClick={()=> onPageChange(currentPage -1)} disabled={currentPage ===1}>
                        <i className="bi bi-caret-left-fill"></i>
                    </button>
                </li>
                {
                    pages.map((page, i) => (
                        <li key={i} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => onPageChange(page)}>{page}</button>
                        </li>
                    ))
                }

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button  className="page-link" onClick={()=> onPageChange(currentPage +1)} disabled={currentPage === totalPages}>
                        <i className="bi bi-caret-right-fill"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;