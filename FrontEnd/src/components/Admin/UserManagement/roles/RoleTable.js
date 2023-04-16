import React, { useMemo } from "react"
import { Button } from 'react-bootstrap';
import CommonTableV8 from "../../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ roles, onDelete, onOpenModify }) => {
    const data = useMemo(() => roles, [roles]);
    const columns = [
        {
            id: "name",
            accessorKey: 'name',
            header: 'Name',
        }, {
            id: 'id',
            accessorKey: 'edit',
            header: 'Edit',
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <Button className='otjs-button otjs-button-orange' onClick={() => onOpenModify(row.original.name)}>Edit</Button>
                    </div>

                )
            }
        }, {
            id: 'delete',
            accessorKey: 'delete',
            header: 'Delete',
            cell: ({ row }) => {
                return (<div className="text-center">
                    <Button className='otjs-button otjs-button-red' name='openDelete'
                        onClick={() => onDelete(row.original.name)}>Delete</Button>
                </div>)
            }
        }
    ];


    return <CommonTableV8 columns={columns} data={data} />
}