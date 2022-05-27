import React, { useState } from 'react';
import SearchForm from './SearchForm';
import apis from '../../services/apis';

import { toast } from 'react-toastify';
import { fillPatientModelWithStudies } from '../../tools/processResponse';
import ContentTable from './ContentTable';

export default () => {

    const [patients, setPatients] = useState([]);

    const sendSearch = async (dataForm) => {
        try {
            let answer = await apis.content.getOrthancFind(dataForm)
            let dicomRessources = fillPatientModelWithStudies(answer)
            let rows = dicomRessources.serialize()
            setPatients(rows)
        } catch (error) {
            console.error(error)
            toast.error(error.statusText)
        }
    }



    return (
        <div>
            <SearchForm onSubmit={sendSearch} />
            {patients.length > 0 ? <ContentTable patients = {patients} /> : null}
        </div>
    )

}