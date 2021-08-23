import React, {Fragment, useMemo} from "react";
import apis from '../../../../services/apis';
import {toast} from "react-toastify";
import CommonTable from "../../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

export default function Certificates({refreshCertificatesData, certificatesData}) {

    const columns = useMemo(() => [{
        accessor: 'label',
        Header: 'Label'
    },
        {
            accessor: 'delete',
            Header: 'Delete certificate',
            Cell: ({row}) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            try {
                                await apis.certificates.deleteCertificate(row.id);
                                refreshCertificatesData()
                            } catch (error) {
                                toast.error(error.statusText)
                            }

                        }} value="Remove"/>
                    </div>)
            },
            formatExtraData: this
        }], [refreshCertificatesData]);


    return (
        <Fragment>
            <CommonTable tableData={certificatesData} columns={columns}/>
        </Fragment>
    )

}

