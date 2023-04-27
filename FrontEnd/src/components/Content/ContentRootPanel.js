import React, { useState } from 'react';

import SearchForm from './SearchForm';
import apis from '../../services/apis';
import ContentTable from './ContentTable';

import { useCustomMutation } from '../../services/ReactQuery/hooks';
import { fillPatientModelWithStudies } from '../../tools/processResponse';
import { errorMessage } from '../../tools/toastify';

export default () => {

    const [patients, setPatients] = useState([]);
    const [dataForm, setDataForm] = useState({})

    const searchMutation = useCustomMutation(
        ({ dataForm }) => apis.content.getOrthancFind(dataForm),
        [],
        (data) => {
            let rows = fillPatientModelWithStudies(data)
            setPatients(rows)
        },
        (error) => errorMessage(error?.data.errorMessage ?? 'Failed')
    )


    const sendSearch = (dataForm) => {
        setDataForm(dataForm)
        searchMutation.mutate({ dataForm })
    }

    return (
        <div>
            <SearchForm onSubmit={sendSearch} />
            {patients.length > 0 ? <ContentTable patients={patients} refreshSearch={() => searchMutation.mutate({ dataForm })} /> : null}
        </div>
    )

}