import React, { useState, useEffect } from "react";
import { CButton, CPagination, CPaginationItem } from "@coreui/react";
import { useSearchParams } from "react-router-dom";

const Paginator = ({
  count,
  onChangePage,
  changeData,
  params,
  page,
  pageSize,
}) => {
  const [pages, setPages] = useState([]);
  // const { limit, offset } = params;
  const [selectedPage, setSelectedPage] = useState(+page ?? 1);
  useEffect(() => {
    let pagesCount = Math.ceil(count / (pageSize ?? 5) || 1);
    let p = [];
    for (let i = 1; i <= pagesCount; i++) {
      p.push(i);
    }
    setPages(() => p);
  }, [count]);
  const changePage = (n) => {
    // setSelectedPage(n);
    changeData?.({
      ...params,
      limit: params?.limit ?? 5,
      offset: (params?.offset ?? 5) * (n - 1),
    });
    onChangePage?.(n);
  };
  return (
    <CPagination aria-label="Page navigation example">
      <CPaginationItem
        aria-label="Previous"
        onClick={() => changePage(+page - 1 < 1 ? 1 : +page - 1)}
        component={CButton}
      >
        <span aria-hidden="true">&laquo;</span>
      </CPaginationItem>

      {pages.map((val) => (
        <CPaginationItem
          key={`page#${val}`}
          active={+page === val}
          onClick={() => changePage(val)}
        >
          {val}
        </CPaginationItem>
      ))}

      <CPaginationItem
        aria-label="Next"
        onClick={() =>
          changePage(+page + 1 > pages.length ? pages.length : +page + 1)
        }
        component={CButton}

      >
        <span aria-hidden="true">&raquo;</span>
      </CPaginationItem>
    </CPagination>
  );
};

export default React.memo(Paginator);
