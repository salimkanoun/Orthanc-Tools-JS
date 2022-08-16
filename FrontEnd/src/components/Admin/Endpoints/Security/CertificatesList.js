import React, {Fragment, useMemo} from "react";
import apis from '../../../../services/apis';
import {toast} from "react-toastify";
import CommonTable from "../../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

export default function Certificates({refreshCertificatesData, certificatesData}) {

    const columns = useMemo(() => [{
        accessor: 'label',
        Header: 'Thêm'
    },
        {
            accessor: 'delete',
            Header: 'Xóa chứng chỉ',
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

                        }} value="Xóa"/>
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

