import React, { useMemo, useState } from 'react'

import SelectModalities from "../../CommonComponents/SearchForm/SelectModalities";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";
import { editCellQuery } from '../../../actions/TableQuery';
import { useDispatch } from 'react-redux';

export default ({ queries = [], aets = [] }) => {

    const dispatch = useDispatch()

    const cellEditHandler = (rowIndex, columnId, value) => {
        dispatch(editCellQuery(rowIndex, columnId, value));
    }

    const columns = useMemo(() => [{
        id: 'key',
        accessorKey: 'key',
        enableHiding: true
    }, {
        accessorKey: 'PatientName',
        header: 'Patient Name',
        isEditable: true
    }, {
        accessorKey: 'PatientID',
        header: 'Patient ID',
        isEditable: true
    }, {
        accessorKey: 'AccessionNumber',
        header: 'Accession Number',
        isEditable: true
    }, {
        accessorKey: 'DateFrom',
        header: 'Date From',
        isEditable: true,
        editionProperties: {
            type: 'CALENDAR'
        }
    }, {
        accessorKey: 'DateTo',
        header: 'Date To',
        isEditable: true,
        editionProperties: {
            type: 'CALENDAR'
        }
    }, {
        accessorKey: 'StudyDescription',
        header: 'Study Description',
        isEditable: true
    }, {
        accessorKey: 'ModalitiesInStudy',
        header: 'Modalities',
        cell: ({ getValue }) => {
            const ModalityComponent = () => {
                const [value, setValue] = useState(getValue());
                const onChange = value => {
                    //setValue(value);
                    //if (onDataChange) onDataChange(initialValue, value, values, id || accessor);
                }

                return (
                    <div>
                        gffgfd
                        <SelectModalities previousModalities={value} onUpdate={onChange} />
                    </div>
                )
            }
            return ModalityComponent
        }
    }, {
        accessorKey: 'Aet',
        header: 'AET',
        isEditable: true,
        editionProperties: {
            type: 'SELECT',
            options: aets.map(aet => ({ value: aet, label: aet }))
        }
    }], []);

    return (
        <CommonTableV8 id='key' columns={columns} data={queries} onCellEdit={cellEditHandler} />
    )
}