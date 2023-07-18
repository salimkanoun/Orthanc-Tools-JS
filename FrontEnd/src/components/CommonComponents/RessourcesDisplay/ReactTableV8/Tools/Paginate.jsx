import React from 'react'
import { ButtonGroup, InputGroup, Button } from 'react-bootstrap'


export default ({ gotoPage, previousPage, nextPage, canPreviousPage, canNextPage, pageIndex, pageCount, pageSize, setPageSize, rowsCount }) => {

    const paginationArray = []
    for (let i = 0; i < Math.floor(rowsCount / 10); i++) {
        paginationArray.push((i + 1) * 10)
        if (i === 5) break
    }
    paginationArray.push('All')

    return (
        <div>
            <ButtonGroup className='mr-2 select_group'>
                <InputGroup>
                    <InputGroup.Text>Show</InputGroup.Text>
                    <select
                        value={pageSize}
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
                <Button variant='warning' onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</Button>
                <Button variant='warning' onClick={() => previousPage()} disabled={!canPreviousPage}>{'<'}</Button>

                <InputGroup>
                    <InputGroup.Text>Page: </InputGroup.Text>

                    <input
                        type='number'
                        className='form-control'
                        value={pageIndex + 1}
                        min="1"
                        max={pageCount}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={
                            {
                                minWidth: '20px',
                                //Remove arrows/spinners
                                WebkitAppearance: 'none',
                                MozAppearance: 'textfield'
                            }
                        }
                    />

                    <InputGroup.Text>of {pageCount}</InputGroup.Text>
                </InputGroup>
                <Button variant='warning' onClick={() => nextPage()} disabled={!canNextPage}>{'>'}</Button>
                <Button variant='warning' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</Button>
            </ButtonGroup>
        </div>
    )
}