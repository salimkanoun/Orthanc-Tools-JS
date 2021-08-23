import React, {Fragment, useMemo} from "react";
import apis from '../../../../services/apis';
import {toast} from "react-toastify";
import CommonTable from "../../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

export default function SshKeys({refreshSshKeysData, sshKeysData}) {

    const columns = useMemo(() => [{
        accessor: 'label',
        Header: 'Label'
    },
        {
            accessor: 'pass',
            Header: 'Has a passphrase',
            Cell: ({row}) => <p>{(row.values.pass ? '✓' : '✖')}</p>
        },
        {
            accessor: 'delete',
            Header: 'Delete Key',
            Cell: ({row}) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            try {
                                await apis.sshKeys.deleteKey(row.values.id);
                                refreshSshKeysData()
                            } catch (error) {
                                toast.error(error.statusText)
                            }

                        }} value="Remove"/>
                    </div>
                )
            },
            formatExtraData: this
        }], [refreshSshKeysData]);

    const data = useMemo(() => sshKeysData, [sshKeysData])

    return (
        <Fragment>
            <CommonTable tableData={data} columns={columns}/>
        </Fragment>
    )
}

