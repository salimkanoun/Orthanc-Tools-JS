import React from "react"
import { useDispatch } from 'react-redux'

import { Button, Dropdown, DropdownButton, OverlayTrigger, Tooltip } from "react-bootstrap"

import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8"
import apis from "../../../services/apis"
import { addSeriesToExportList, addStudiesToExportList } from "../../../actions/ExportList"
import Study from "../../../model/Study"
import Series from "../../../model/Series"

export default ({ jobs }) => {

    const dispatch = useDispatch()

    const handleExportClick = async (level, studyInstanceUID, seriesInstanceUID) => {

        if (level === 'Series') {

            const seriesOrthancID = await apis.content.getOrthancFind({
                Level: level,
                Query: {
                    '0020,000E': seriesInstanceUID
                }
            })
            const seriesInfo = await apis.content.getSeriesDetails(seriesOrthancID[0])
            let series = new Series()
            series.fillFromOrthanc(seriesInfo.ID, seriesInfo.MainDicomTags, seriesInfo.Instances, seriesInfo.ParentStudy)
            const seriesObject = series.serialize()
            dispatch(addSeriesToExportList([seriesObject]))

        } else if (level === 'Study') {

            const studyOrthancID = await apis.content.getOrthancFind({
                Level: level,
                Query: {
                    '0020,000D': studyInstanceUID
                }
            })
            const studyDetails = await apis.content.getStudiesDetails(studyOrthancID[0])

            let study = new Study()
            study.fillFromOrthanc(studyDetails.ID, studyDetails.MainDicomTags, studyDetails.Series)
            study.fillParentPatient(studyDetails.ParentPatient, studyDetails.PatientMainDicomTags)
            const studyObject = study.serialize()
            dispatch(addStudiesToExportList([studyObject]))
            
        }
    }

    const columns = [
        {
            id: 'JobID',
            accessorKey: 'data.ID',
            header: "Job ID",
            enableHiding: true
        },
        {
            accessorKey: 'content',
            header: 'Type',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        },
        {
            accessorKey: 'data.State',
            header: "Job Status",
            style: { whiteSpace: 'normal', wordWrap: 'break-word' },
            cell: ({ getValue }) => getValue() ?? 'Unknown'
        },
        {
            header: 'Details',
            cell: ({ row }) => {
                const renderTooltip = (props) => (
                    <Tooltip id="button-tooltip" {...props}>
                        {JSON.stringify(row.original.data, null, 2)}
                    </Tooltip>
                );
                return (
                    <OverlayTrigger
                        placement="left"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                    >
                        <Button variant="info"> Show Details </Button>
                    </OverlayTrigger>
                )
            }
        },
        {
            header: 'Actions',
            cell: ({ row }) => {
                const state = row.original.data.State
                const level = row.original.data.level
                const studyInstanceUID = row.original.data.studyInstanceUID
                const seriesInstanceUID = row.original.data.seriesInstanceUID
                const type = row.original.content

                return (
                    <DropdownButton>
                        <Dropdown.Item onClick={() => handleExportClick(level, studyInstanceUID, seriesInstanceUID)} disabled={type !== 'Retrieve' || state !== 'Success'} >To Export</Dropdown.Item>
                    </DropdownButton>
                )
            }
        }
    ]

    return (
        <CommonTableV8 columns={columns} data={jobs} />
    )

}