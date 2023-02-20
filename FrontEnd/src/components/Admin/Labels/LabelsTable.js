import React, { useMemo } from "react";
import { Button } from "react-bootstrap";
import { keys } from "../../../model/Constant";
import apis from "../../../services/apis";
import { useCustomMutation } from "../../CommonComponents/ReactQuery/hooks";
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";


export default ({ labels, handlerManageRole }) => {

    const deleteLabels = useCustomMutation(
        ({label}) => apis.label.deleteLabels(label),
        [[keys.LABELS_KEY]]
    )

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
                    onClick={() => deleteLabels.mutate(row.values.label_name)}>Delete Label
                </Button>
            </div>)
        }
    ], [handlerManageRole,]);


    return (
        <CommonTable columns={columns} data={labels} />
    );

}