import React, { useMemo } from "react";
import { Link } from "react-router-dom";

import CommonTableV8 from "../ReactTableV8/CommonTableV8";

export default ({
    robots,
    validationRobotHandler,
    deleteJobHandler,
    hideValidationButton
}) => {


    const columns = [
        {
            id: 'id',
            accessorKey: 'id',
            header: 'id',
            hidden: true,
        },
        {
            id: 'name',
            accessorKey: 'name',
            header: 'Name'
        }, {
            id: 'username',
            accessorKey: 'username',
            header: 'Username'
        }, {
            id: 'quesriesNb',
            accessorKey: 'queriesNb',
            header: 'Number of Queries'
        }, {
            id: 'validation',
            accessorKey: 'validation',
            header: 'Progress Validation'
        }, {
            id: 'retrieve',
            accessorKey: 'retrieve',
            header: 'Progress Retrieve'
        }, {
            id: 'state',
            accessorKey: 'state',
            Header: 'State'
        }, {
            id: 'details',
            header: 'Show Details',
            cell: ({ row }) => {
                return <Link className='nav-link otjs-button otjs-button-blue'
                    to={'/robot/' + row.values.id}> Details </Link>
            }
        }, {
            id: 'approved',
            accessorKey: "approved",
            header: 'approved',
            hidden: true
        }, {
            id: 'valid',
            accessorKey: 'valid',
            header: 'Validation Status',
            hidden: hideValidationButton,
            cell: ({ row }) => {
                if (row.original.valid) {
                    if (!row.original.approved) {
                        return (
                            <div className="text-center">
                                <input type="button" className='otjs-button otjs-button-green w-7'
                                    onClick={() => validationRobotHandler(row.original.id)}
                                    value="Validate" />
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
            header: 'Remove Robot',
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red w-10'
                            onClick={() => deleteJobHandler(row.original.id)}
                            value="Remove Job" />
                    </div>
                )
            }
        }
    ]

    const data = useMemo(() => robots, [robots]);

    return <CommonTableV8 columns={columns} data={data} pagination />
}