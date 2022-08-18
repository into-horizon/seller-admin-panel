import React, { useState, useEffect }from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'
import cookie from 'react-cookies'
const  Paginator = ({count, onChangePage, changeData, status, order_id}) =>  {
    const [pages, setPages] = useState([])
    const [selectedPage, setSelectedPage] = useState(Number(cookie.load('selectedPagePending')) || 1)
    useEffect(() => {
        let pagesCount = Math.ceil(count / 5 || 1)
        let p = []
        for (let i = 1; i <= pagesCount; i++) {
            p.push(i)
        }
        setPages(x => p)
    }, [count])
    const changePage = n => {
        setSelectedPage(n)
        cookie.save('selectedPageOverView', n)
        changeData({ limit: 5, offset: 5 * (n - 1), status: status, order_id: order_id })
        // onChangePage(n)
    }
    return (
        <CPagination aria-label="Page navigation example">
            <CPaginationItem aria-label="Previous" onClick={() => changePage(selectedPage - 1 < 1 ? 1 : selectedPage - 1)}>
                <span aria-hidden="true">&laquo;</span>
            </CPaginationItem>

            {pages.map((val) => <CPaginationItem key={`page#${val}`} active={selectedPage === val} onClick={() => changePage(val)}>{val}</CPaginationItem>)}

            <CPaginationItem aria-label="Next" onClick={() => changePage(selectedPage + 1 > pages.length ? pages.length : selectedPage + 1)}>
                <span aria-hidden="true">&raquo;</span>
            </CPaginationItem>
        </CPagination>
    )
}

export default Paginator