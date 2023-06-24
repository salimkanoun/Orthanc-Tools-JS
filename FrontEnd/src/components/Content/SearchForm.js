import React from 'react'

import SearchForm from '../CommonComponents/SearchForm/SearchForm'

export default ({ onSubmit }) => {

    const dataSearch = (formData) => {
        //dateForm
        let date = ""
        if (formData.dateFrom !== "" || formData.dateTo !== "") //if dateFrom or dateTo isn't empty 
            date = formData.dateFrom.replace('-', '').replace('-', '') + '-' + formData.dateTo.replace('-', '').replace('-', '')
        let contentSearch = {
            Level: 'Study',
            CaseSensitive: false,
            Expand: true,
            Query: {
                PatientName: formData.patientName,
                PatientID: formData.patientID,
                AccessionNumber: formData.accessionNumber,
                StudyDate: date,
                ModalitiesInStudy: formData.modalities,
                StudyDescription: formData.studyDescription
            }
        }

        //Call submit function to be handled by parent
        onSubmit(contentSearch)

    }

    return (
        <SearchForm buttonsName={['Search']} title="Search" icon="fas fa-search" onFormValidate={dataSearch} />
    )
}
