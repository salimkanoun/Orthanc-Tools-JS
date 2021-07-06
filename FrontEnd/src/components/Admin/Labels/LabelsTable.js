import React, {useMemo} from "react";
import {Button} from "react-bootstrap";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";


export default function LabelsTable({labels, handlerManageRole, handlerDelete}) {
    const columns = useMemo(() => [
        {
            accessor: 'label_name',
            Header: 'Label',
            hidden: false
        },
        {
            id: '_r',
            Header: 'Roles',
            Cell: ({row}) => <Button variant={"primary"}
                                     onClick={() => handlerManageRole(row.values.label_name)}>Manage
                Roles</Button>
        },
        {
            id: '_d',
            Header: 'Delete',
            Cell: ({row}) => <Button variant={"danger"}
                                     onClick={() => handlerDelete(row.values.label_name)}>Delete
                Label</Button>
        }
    ], [handlerManageRole, handlerDelete]);


    return (
        <CommonTable columns={columns} tableData={labels}/>
    );

}