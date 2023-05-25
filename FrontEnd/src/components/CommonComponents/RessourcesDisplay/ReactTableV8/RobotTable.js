import React from "react";

import CommonTableV8 from "./CommonTableV8";
import { Button } from "react-bootstrap";

export default ({
    robots,
    validationRobotHandler,
    deleteJobHandler,
    hideValidationButton,
    additionalColumns = [],
    onShowDetails = () => { }
}) => {

    const columns = [
        {
            id: 'id',
            accessorKey: 'id',
            header: 'id',
            enableHiding: true
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
            accessorFn: (row) => {
                return row.details?.items.length
            },
            header: 'Number of Queries'
        }, {
            id: 'validation',
            accessorFn: (row) => {
                return row?.progress?.validation
            },
            header: 'Progress Validation'
        }, {
            id: 'retrieve',
            accessorFn: (row) => {
                return row?.progress?.retrieve
            },
            header: 'Progress Retrieve'
        }, {
            id: 'state',
            accessorKey: 'state',
            header: 'State'
        }, {
            id: 'details',
            header: 'Show Details',
            cell: ({row}) => {
                return <Button
                    className='nav-link otjs-button otjs-button-blue'
                    onClick={() => onShowDetails(row.original.id)}
                > Details </Button>
            }
        }, {
            id: 'approved',
            header: 'Approved',
            accessorKey: "approved",
            accessorFn: (row) => {
                return row?.details?.approved
            }
        }, {
            id: 'valid',
            accessorKey: 'valid',
            header: 'Validation Status',
            hidden: hideValidationButton,
            cell: ({ row }) => {
                if (row.original.valid) {
                    if (!row.original.approved) {
                        return (
                            <Button className='otjs-button otjs-button-green w-7'
                                onClick={() => validationRobotHandler(row.original.id)}>
                                Robots
                            </Button>
                        )
                    } else {
                        return (<p> Validated & approved </p>)
                    }
                } else {
                    return (<p> Analysing project </p>)
                }
            }
        },
        {
            id: 'remove',
            header: 'Remove Robot',
            cell: ({ row }) => {
                return (
                    <Button className='otjs-button otjs-button-red w-10'
                        onClick={() => deleteJobHandler(row.original.id)}
                        value="Remove Job" >Remove Job
                    </Button>
                )
            }
        }
    ]

    return <CommonTableV8 id="id" columns={[...columns, ...additionalColumns]} data={robots} paginated />
}