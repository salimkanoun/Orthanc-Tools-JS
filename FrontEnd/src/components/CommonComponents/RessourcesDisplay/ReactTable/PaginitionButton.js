import {Button, ButtonGroup, InputGroup} from "react-bootstrap";

export default function PaginitionButton({
                                             gotoPage,
                                             previousPage,
                                             nextPage,
                                             canPreviousPage,
                                             canNextPage,
                                             pageIndex,
                                             pageCount,
                                             pageOptions,
                                             pageSize,
                                             setPageSize,
                                             rowsCount
                                         }) {
    let paginationArray = []
    for (let i = 0; i < Math.floor(rowsCount / 10); i++) {
        paginationArray.push((i + 1) * 10)
        if (i === 5) break
    }
    paginationArray.push('All')

    console.log(gotoPage)
    return (
        <div>
            <ButtonGroup className='mr-3'>
                <InputGroup>
                    <InputGroup.Text>Show</InputGroup.Text>

                    <select
                        value={pageSize}
                        className="form-control"
                        onChange={e => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {paginationArray.map(pageSize => (
                            <option key={pageSize} value={typeof pageSize === 'number' ? pageSize : rowsCount}>
                                {typeof pageSize === 'number' ? pageSize : 'All'}
                            </option>
                        ))}
                    </select>
                </InputGroup>
            </ButtonGroup>
            <ButtonGroup>
                <InputGroup style={{paddingRight: '4px'}}>

                    <Button variant='outline-primary' onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}>{'<<'}</Button>
                    <Button variant='outline-primary' onClick={() => previousPage()}
                            disabled={!canPreviousPage}>{'<'}</Button>
                    <InputGroup.Text>Page:{' '}</InputGroup.Text>
                    <input
                        type='number'
                        className="form-control"
                        value={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{width: '100px'}}
                    />
                    <InputGroup.Text>of {pageOptions.length}</InputGroup.Text>

                    <Button variant='outline-primary' onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</Button>
                    <Button variant='outline-primary' onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}>{'>>'}</Button>
                </InputGroup>
            </ButtonGroup>
        </div>
    )
}