import React, {useMemo} from "react";
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
            Cell: ({row}) => (<div className="text-center">
                                <button className="otjs-button otjs-button-orange w-10"
                                    onClick={() => handlerManageRole(row.values.label_name)}>Manage Roles</button>
                            </div>)
        },
        {
            id: '_d',
            Header: 'Delete',
            Cell: ({row}) => (<div className="text-center">
                                <button className="otjs-button otjs-button-red w-10"
                                     onClick={() => handlerDelete(row.values.label_name)}>Delete Label</button>
                            </div>)
        }
    ], [handlerManageRole, handlerDelete]);


    return (
        <CommonTable columns={columns} tableData={labels}/>
    );

}