import React, { useMemo } from "react";
import { Button } from "react-bootstrap";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";


export default ({ labels, handlerManageRole, handlerDelete }) => {
    const columns = useMemo(() => [
        {
            accessor: 'label_name',
            Header: 'Label',
            hidden: false
        },
        {
            id: '_r',
            Header: 'Roles',
            Cell: ({ row }) => (<div className="text-center">
                <Button className="otjs-button otjs-button-orange w-10"
                    onClick={() => handlerManageRole(row.values.label_name)}>Manage Roles
                </Button>
            </div>)
        },
        {
            id: '_d',
            Header: 'Delete',
            Cell: ({ row }) => (<div className="text-center">
                <Button className="otjs-button otjs-button-red w-10"
                    onClick={() => handlerDelete(row.values.label_name)}>Delete Label
                </Button>
            </div>)
        }
    ], [handlerManageRole, handlerDelete]);


    return (
        <CommonTable columns={columns} data={labels} />
    );

}