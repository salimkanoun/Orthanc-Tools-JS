import React, { useMemo } from 'react'
import CommonTable from '../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable';

export default ({ tasks, deleteJobHandler, setSelectedTask }) => {
    const columns = useMemo(() => [{
        accessor: 'id',
        Header: 'id'
    }, {
        accessor: 'queriesNb',
        Header: 'Number of Queries'
    }, {
        accessor: 'state',
        Header: 'State'
    }, {
        id: 'details',
        Header: 'Show Details',
        Cell: ({ row }) => {
            return (<div className="text-center">
                <input type="button" className='otjs-button otjs-button-green w-10'
                    onClick={() => setSelectedTask(row.values.id)}
                    value="Show Result" />
            </div>)
        }
    }, {
        id: 'remove',
        Header: 'Remove Robot',
        Cell: ({ row }) => {
            return (
                <div className="text-center">
                    <input type="button" className='otjs-button otjs-button-red w-10'
                        onClick={() => deleteJobHandler(row.id)}
                        value="Remove Job" />
                </div>
            )
        }
    }], [deleteJobHandler, setSelectedTask]);

    const data = useMemo(() => tasks, [tasks]);

    return <CommonTable columns={columns} data={data} />
}
