import React, { useMemo } from "react";

import { Button } from "react-bootstrap";

import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";
import { useCustomMutation } from "../../CommonComponents/ReactQuery/hooks";

import { keys } from "../../../model/Constant";
import apis from "../../../services/apis";
import { errorMessage, successMessage } from "../../../tools/toastify";


export default ({ labels = [], handlerManageRole }) => {

    const deleteLabels = useCustomMutation(
        ({ name }) => apis.label.deleteLabels(name),
        [[keys.LABELS_KEY]],
        () => successMessage('Deleted'),
        () => errorMessage('Failed, remove all roles before label deletion')
    )

    const columns = useMemo(() => [
        {
            accessorKey: 'name',
            header: 'Label'
        },
        {
            header: 'Roles',
            cell: ({ row }) => (
                <div className="text-center">
                    <Button className="otjs-button otjs-button-orange w-10"
                        onClick={() => handlerManageRole(row.original.name)}>Manage Roles
                    </Button>
                </div>
            )
        },
        {
            header: 'Delete',
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <Button className="otjs-button otjs-button-red w-10"
                            onClick={() => deleteLabels.mutate({ name: row.original.name })}>Delete Label
                        </Button>
                    </div>
                )
            }
        }
    ], [handlerManageRole]);


    return (
        <CommonTableV8 canFilter columns={columns} data={labels} />
    );

}