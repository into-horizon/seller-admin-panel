import React, { useState, useEffect } from 'react'
import { CButton, CPagination, CPaginationItem } from '@coreui/react'

const Paginator = ({ count, onChangePage, changeData, params, page, pageSize }) => {
  page = +page
  const [pages, setPages] = useState([])
  useEffect(() => {
    let p = []
    const siblingCount = 5

    let pagesCount = Math.ceil(count / (pageSize ?? 5) || 1)

    if (pagesCount < siblingCount) {
      for (let i = 1; i <= pagesCount; i++) {
        p.push(i)
      }
    } else {
      let firstPages = [1, 2, 3]
      let lastPages = [pagesCount - 2, pagesCount - 1, pagesCount]
      if (page === 1) {
        p = [...firstPages, '...', ...lastPages]
      } else if (page === pagesCount) {
        p = [...firstPages, '...', ...lastPages]
      } else if (firstPages.includes(page)) {
        p = [1, page - 1, page, page + 1, '...', ...lastPages]
      } else if (lastPages.includes(page)) {
        p = [1, ...firstPages, '...', page - 1, page, page + 1, pagesCount]
      } else {
        if (firstPages.includes(page - 1)) {
          p = [...firstPages.splice(0, 2), page - 1, page, page + 1, '....', ...lastPages.slice(1)]
        } else if (lastPages.includes(page + 1)) {
          p = [...firstPages.splice(0, 2), '...', page - 1, page, page + 1, ...lastPages.slice(1)]
        } else {
          p = [
            ...firstPages.splice(0, 2),
            '...',
            page - 1,
            page,
            page + 1,
            '....',
            ...lastPages.slice(1),
          ]
        }
      }
    }

    setPages(p.filter((v, i, a) => a.indexOf(v) === i))
  }, [count, page])
  const changePage = (n) => {
    // setSelectedPage(n);
    changeData?.({
      ...params,
      limit: params?.limit ?? 5,
      offset: (params?.offset ?? 5) * (n - 1),
    })
    onChangePage?.(n)
  }
  return (
    <CPagination aria-label="Page navigation example">
      <CPaginationItem
        aria-label="Previous"
        onClick={() => changePage(+page - 1 < 1 ? 1 : +page - 1)}
        component={CButton}
      >
        <span aria-hidden="true">&laquo;</span>
      </CPaginationItem>

      {pages.map((val, i) => (
        <CPaginationItem
          key={`page#${val}#${i}`}
          active={+page === val}
          onClick={() => changePage(val)}
        >
          {val}
        </CPaginationItem>
      ))}

      <CPaginationItem
        aria-label="Next"
        onClick={() => changePage(+page + 1 > pages.length ? pages.length : +page + 1)}
        component={CButton}
      >
        <span aria-hidden="true">&raquo;</span>
      </CPaginationItem>
    </CPagination>
  )
}

export default React.memo(Paginator)
