import React, { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8"
import { seriesQueryColumns, studyQueryColumns } from "../../CommonComponents/RessourcesDisplay/ReactTableV8/ColomnFactories"
import apis from "../../../services/apis"
import { errorMessage, infoMessage, updateToast } from "../../../tools/toastify"
import { addSeriesDetails } from "../../../actions/TableResult"

export default () => {

    const dispatch = useDispatch()
    const store = useSelector(state => {
        return {
            results: state.AutoRetrieveResultList.results,
            resultsSeries: state.AutoRetrieveResultList.resultsSeries
        }
    })

    const queryAndAddSeriesDetails = async (studyUID, aet) => {
        let queryData = {
            Level: 'Series',
            Query: {
                Modality: '',
                ProtocolName: '',
                SeriesDescription: '',
                SeriesInstanceUID: '',
                StudyInstanceUID: studyUID,
                SeriesNumber: '',
                NumberOfSeriesRelatedInstances: ''
            }
        }
        try {
            let queryAnswers = await apis.query.dicomQuery(aet, queryData);
            let seriesAnswers = await apis.query.retrieveAnswer(queryAnswers['ID'])
            dispatch(addSeriesDetails(seriesAnswers, studyUID))
        } catch (error) {
            errorMessage(error?.data?.errorMessage ?? 'Query Failure StudyInstanceUID' + studyUID)
        }

    }


    useEffect(() => {
        const startFetchingSeriesDetails = async () => {
            //List studies for each series details are missing
            let emptyResultArray = []
            let knownStudies = Object.values(store.results)
            let availableStudyUID = Object.values(store.resultsSeries).map((series) => {
                return series['StudyInstanceUID']
            })

            let missingSeriesDetails = knownStudies.filter(study => !availableStudyUID.includes(study.StudyInstanceUID))
            if (missingSeriesDetails.length > 0) {
                const toastId = infoMessage('Starting Series Fetching');
                for (let i = 0; i < missingSeriesDetails.length; i++) {
                    await queryAndAddSeriesDetails(missingSeriesDetails[i].StudyInstanceUID, missingSeriesDetails[i].OriginAET)
                    updateToast(toastId, 'Queried series ' + (i + 1) + '/' + emptyResultArray.length);
                }
                updateToast(toastId, 'Queried series Finihsed');
            }

        }
        startFetchingSeriesDetails()
    }, [])

    const columns = [
        studyQueryColumns.PATIENT_NAME,
        studyQueryColumns.PATIENT_ID,
        studyQueryColumns.ACCESSION_NUMBER,
        studyQueryColumns.STUDY_DATE,
        studyQueryColumns.STUDY_DESCRIPTION,
        studyQueryColumns.REQUESTED_PROCEDURE,
        seriesQueryColumns.SERIES_INSTANCE_UID,
        seriesQueryColumns.SERIES_DESCRIPTION,
        seriesQueryColumns.MODALITY,
        seriesQueryColumns.NB_SERIES_INSTANCES,
        seriesQueryColumns.AET
    ]

    const data = useMemo(() => {
        let seriesLines = []
        for (let seriesUID of Object.keys(store.resultsSeries)) {
            seriesLines.push({
                ...store.results[store.resultsSeries[seriesUID]['StudyInstanceUID']],
                ...store.resultsSeries[seriesUID],
            })
        }
        return seriesLines
    }, [store.results, store.resultsSeries])

    return (
        <CommonTableV8 canSort data={data} columns={columns} paginated canFilter />
    )
}