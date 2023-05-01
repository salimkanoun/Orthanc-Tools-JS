import React, { useMemo } from "react"
import CommonTableV8 from "../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({ jobs }) => {

    const columns = useMemo(() => [
        {
            accessorKey: 'cdJobID',
            enableHiding: true
        },
        {
            accessorKey: 'timeStamp',
            enableHiding: true
        },
        {
            accessorKey: 'patientName',
            header: 'Patient Name'
        },
        {
            accessorKey: 'patientID',
            header: 'Patient ID'
        },
        {
            accessorKey: 'patientDOB',
            header: 'Patient Birth Date'
        },
        {
            accessorKey: 'studyDate',
            header: 'Study Date'
        },
        {
            accessorKey: 'studyDescription',
            header: 'Study Description'
        },
        {
            accessorKey: 'status',
            header: 'CD Status'
        },
        {
            id: 'cancelButton',
            header: 'Cancel',
            Cell: ({ row }) => {
                let disable = (row.original.status === CDBurner.JOB_STATUS_BURNING_DONE || row.original.status === CDBurner.JOB_STATUS_BURNING_ERROR)
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            try {
                                await apis.cdBurner.cancelCdBurner(row.original.cdJobID)
                            } catch (error) {
                                errorMessage(error.statusText)
                            }

                        }} value="Cancel" disabled={disable} />
                    </div>
                )
            }
        }
    ], []);

    return <CommonTableV8 columns={columns} data={jobs} />
}