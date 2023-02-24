import React, { useMemo } from "react"
import { Button } from 'react-bootstrap';
import CommonTableV8 from "../../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";
import ModifyRole from "./ModifyRole";


export default ({ roles, onDelete }) => {
    const data = useMemo(() => roles, [roles]);
    const columns = [
        {
            id : "name",
            accessorKey: 'name',
            header: 'Name',
        }, {
            id : 'id',
            accessorKey: 'edit',
            header: 'Edit',
            cell: ({ row }) => {
                return <ModifyRole name={row.name} />
            }
        }, {
            id : 'delete',
            accessorKey: 'delete',
            header: 'Delete',
            cell: ({ row }) => {
                return (<div className="text-center">
                    <Button className='otjs-button otjs-button-red' name='openDelete'
                        onClick={() => onDelete(row.values.name)}>Delete</Button>
                </div>)
            }
        }
    ];


    return <CommonTableV8 columns={columns} data={data} />
}