import React, { useState } from 'react';
import SearchForm from './SearchForm';
import apis from '../../services/apis';

import { connect } from 'react-redux';
import { addStudiesToDeleteList } from '../../actions/DeleteList';
import { addStudiesToExportList } from '../../actions/ExportList';
import { addStudiesToAnonList } from '../../actions/AnonList';
import { toast } from 'react-toastify';
import { studyArrayToNestedData } from '../../tools/processResponse';
import ContentTable from './ContentTable';

//a passer en fonctionnal component 

export function ContentRootPanel(props) {

    const [patients, setPatients] = useState([]);

    const sendSearch = async (dataForm) => {
        try {
            let answer = await apis.content.getOrthancFind(dataForm)
            let nestedData = studyArrayToNestedData(answer)
            setPatients(Object.values(nestedData))
        } catch (error) {
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

//connect redux fonctionnal componnent
const mapDispatchToProps = {
    addStudiesToDeleteList,
    addStudiesToAnonList,
    addStudiesToExportList
}


export default connect(null, mapDispatchToProps)(ContentRootPanel)