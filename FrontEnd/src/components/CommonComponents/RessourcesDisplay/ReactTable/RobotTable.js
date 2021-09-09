import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import CommonTable from "./CommonTable";

export default function RobotTable({
                                       robots,
                                       validationRobotHandler,
                                       deleteJobHandler,
                                       refreshHandler,
                                       hideValidationButton
                                   }) {
    const columns = useMemo(() => [
        {
            accessor: 'id',
            show: false,
        },
        {
            accessor: 'name',
            Header: 'Name'
        }, {
            accessor: 'username',
            Header: 'Username'
        }, {
            accessor: 'queriesNb',
            Header: 'Number of Queries'
        }, {
            accessor: 'validation',
            Header: 'Progress Validation'
        }, {
            accessor: 'retrieve',
            Header: 'Progress Retrieve'
        }, {
            accessor: 'state',
            Header: 'State'
        }, {
            id: 'details',
            Header: 'Show Details',
            Cell: ({row}) => {
                return <Link className='nav-link otjs-button otjs-button-blue'
                             to={'/robot/' + row.values.id}> Details </Link>
            }
        }, {
            accessor: "approved",
            show: false
        }, {
            accessor: 'valid',
            Header: 'Validation Status',
            show: !hideValidationButton,
            Cell: ({row}) => {
                if (row.values.valid) {
                    if (!row.values.approved) {
                        return (
                            <div className="text-center">
                                <input type="button" className='otjs-button otjs-button-green w-7'
                                       onClick={() => validationRobotHandler(row.values.id, refreshHandler)}
                                       value="Validate"/>
                            </div>
                        )
                    } else {
                        return (<p> Validated & approved </p>)
                    }
                } else {
                    return (<p> Analysing project </p>)
                }
            }
        }, {
            id: 'remove',
            Header: 'Remove Robot',
            Cell: ({row}) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red w-10'
                               onClick={() => deleteJobHandler(row.values.id, refreshHandler)}
                               value="Remove Job"/>
                    </div>
                )
            }
        }], [validationRobotHandler, deleteJobHandler, refreshHandler, hideValidationButton])

    const data = useMemo(() => robots, [robots]);

    return <CommonTable columns={columns} tableData={data} pagination/>
}