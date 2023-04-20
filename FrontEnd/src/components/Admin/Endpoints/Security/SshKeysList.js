import React, { useMemo } from "react";
import { Button } from "react-bootstrap";

import apis from '../../../../services/apis';
import CommonTableV8 from "../../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";
import { keys } from "../../../../model/Constant";
import { useCustomMutation } from "../../../../services/ReactQuery/hooks";

export default ({ sshKeysData }) => {

    const deleteKey = useCustomMutation(
        ({id}) => {
            apis.sshKeys.deleteKey(id)
        },
        [[keys.SSH_KEY]]
    )

    const columns = [
        {
            id: 'label',
            accessorKey: 'label',
            header: 'Label'
        },
        {
            id: 'pass',
            accessorKey: 'pass',
            header: 'Has a passphrase',
            cell: ({ row }) => <p>{(row.values.pass ? '✓' : '✖')}</p>
        },
        {
            id: 'delete',
            accessorKey: 'delete',
            header: 'Delete Key',
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <Button className='otjs-button otjs-button-red' onClick={() => deleteKey.mutate(row.value.id)}> Remove </Button> 
                    </div>
                )
            },
            formatExtraData: this
        }
    ]

    const data = useMemo(() => sshKeysData, [sshKeysData])

    return (
        <>
            <CommonTableV8 data={data} columns={columns} />
        </>
    )
}

