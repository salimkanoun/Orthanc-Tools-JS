import React, { Fragment, useMemo } from "react";
import apis from '../../../../services/apis';
import { toast } from "react-toastify";
import CommonTable from "../../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";
import CommonTableV8 from "../../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ refreshCertificatesData, certificatesData }) => {

    const columns = [
        {
            id: 'label',
            accessorKey: 'label',
            header: 'Label'
        },
        {
            id: 'delete',
            accessorKey: 'delete',
            header: 'Delete certificate',
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            try {
                                await apis.certificates.deleteCertificate(row.id);
                                refreshCertificatesData()
                            } catch (error) {
                                toast.error(error.statusText, { data: { type: 'notification' } })
                            }

                        }} value="Remove" />
                    </div>)
            },
            formatExtraData: this
        }
    ]


    return (
        <Fragment>
            <CommonTableV8 data={certificatesData} columns={columns} />
        </Fragment>
    )

}

