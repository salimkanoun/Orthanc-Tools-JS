import React, { Fragment, useMemo } from "react";
import apis from '../../../../services/apis';
import { toast } from "react-toastify";
import CommonTable from "../../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";
import CommonTableV8 from "../../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ refreshSshKeysData, sshKeysData }) => {

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
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            try {
                                await apis.sshKeys.deleteKey(row.values.id);
                                refreshSshKeysData()
                            } catch (error) {
                                toast.error(error.statusText, { data: { type: 'notification' } })
                            }

                        }} value="Remove" />
                    </div>
                )
            },
            formatExtraData: this
        }
    ]

    const data = useMemo(() => sshKeysData, [sshKeysData])

    return (
        <Fragment>
            <CommonTableV8 data={data} columns={columns} />
        </Fragment>
    )
}

