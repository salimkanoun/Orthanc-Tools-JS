import React, { useState } from 'react';
import SearchForm from './SearchForm';
import apis from '../../services/apis';

import { toast } from 'react-toastify';
import { fillPatientModelWithStudies } from '../../tools/processResponse';
import ContentTable from './ContentTable';
import { useCustomMutation } from '../../services/ReactQuery/hooks';
import { errorMessage } from '../../tools/toastify';

export default () => {

    const [patients, setPatients] = useState([]);

    const searchMutation = useCustomMutation(
        ({dataForm}) => apis.content.getOrthancFind(dataForm),
        [],
        (data) => {
            console.log(data)
            let dicomRessources = fillPatientModelWithStudies(data)
            let rows = dicomRessources.serialize()
            setPatients(rows)
        },
        (error) => errorMessage(error?.data.errorMessage ?? 'Failed')
    )


    const sendSearch = (dataForm) => {
        searchMutation.mutate({dataForm})
    }

    return (
        <div>
            <SearchForm onSubmit={sendSearch} />
            {patients.length > 0 ? <ContentTable patients = {patients} /> : null}
        </div>
    )

}