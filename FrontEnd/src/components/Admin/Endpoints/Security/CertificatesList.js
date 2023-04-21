import React from "react";

import apis from '../../../../services/apis';
import CommonTableV8 from "../../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";
import { keys } from "../../../../model/Constant";
import { useCustomMutation } from "../../../../services/ReactQuery/hooks";

export default ({ certificatesData }) => {

    const deleteCertificate = useCustomMutation(
        ({ id }) => {
            apis.certificates.deleteCertificate(id);
        },
        [[keys.CERTIFICATES_KEY]]
    )

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
                        <input type="button" className='otjs-button otjs-button-red' onClick={() => { deleteCertificate.mutate(row.id) }} value="Remove" />
                    </div>)
            },
            formatExtraData: this
        }
    ]


    return (
        <>
            <CommonTableV8 data={certificatesData} columns={columns} />
        </>
    )

}

