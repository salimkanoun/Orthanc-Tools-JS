import React, { useMemo } from "react";
import { Button } from "react-bootstrap";
import { keys } from "../../../model/Constant";
import apis from "../../../services/apis";
import { useCustomMutation } from "../../CommonComponents/ReactQuery/hooks";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";


export default ({ labels, handlerManageRole }) => {

    const deleteLabels = useCustomMutation(
        ({ label }) => apis.label.deleteLabels(label),
        [[keys.LABELS_KEY]]
    )

    const columns = useMemo(() => [
        {
            accessorKey: 'label_name',
            header: 'Label'
        },
        {
            header: 'Roles',
            Cell: ({ row }) => (
                <div className="text-center">
                    <Button className="otjs-button otjs-button-orange w-10"
                        onClick={() => handlerManageRole(row.original.label_name)}>Manage Roles
                    </Button>
                </div>
            )
        },
        {
            header: 'Delete',
            Cell: ({ row }) => (
                <div className="text-center">
                    <Button className="otjs-button otjs-button-red w-10"
                        onClick={() => deleteLabels.mutate(row.original.label_name)}>Delete Label
                    </Button>
                </div>
            )
        }
    ], [handlerManageRole]);


    return (
        <CommonTableV8 columns={columns} data={labels} />
    );

}