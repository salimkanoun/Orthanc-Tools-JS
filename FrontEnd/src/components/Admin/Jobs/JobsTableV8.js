import React, { useMemo } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";

import apis from "../../../services/apis";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";
import ModalDetailsV8 from "./ModalDetailsV8";
import { errorMessage } from "../../../tools/toastify";

export default ({ rows }) => {

    const data = useMemo(() => rows, [rows]);

    const onResubmitJob = (jobId) => {
        apis.jobs.resumbitJob(jobId).catch(error => errorMessage(error.response.statusText));
    }

    const onResumeJob = (jobId) => {
        apis.jobs.resumeJob(jobId).catch(error => errorMessage(error.response.statusText))
    }

    const onPauseJob = (jobId) => {
        apis.jobs.pauseJob(jobId).catch(error => errorMessage(error.response.statusText))
    }

    const onCancelJob = (jobId) => {
        apis.jobs.cancelJob(jobId).catch(error => errorMessage(error.response.statusText))
    }

    const dropDown = (id) => {
        return (
            <Dropdown className="text-center">
                <Dropdown.Toggle variant="button-dropdown-blue" id="dropdown-basic" className="button-dropdown button-dropdown-green">
                    Actions
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item className='bg-green' onClick={() => onResubmitJob(id)}>Resumbit</Dropdown.Item>

                    <Dropdown.Item className='bg-blue' onClick={() => onResumeJob(id)}>Resume</Dropdown.Item>
    
                    <Dropdown.Item className='bg-orange' onClick={() => onPauseJob(id)}>Pause</Dropdown.Item>
    
                    <Dropdown.Item className='bg-red' onClick={() => onCancelJob(id) }>Cancel</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    const columnsJobs = [
        {
            id: 'ID',
            accessorKey: 'ID',
            header: "ID",
            cell: row => <i>{row.getValue()}</i>,
            filterType: "STRING",
            isEditable : true,
        },
        {
            id: 'Progress',
            accessorKey: 'Progress',
            header: "Progress",
            cell: row => <i>{row.getValue()}</i>,
            filterType: "NUMBER",
        },
        {
            id: 'State',
            accessorKey: 'State',
            header: "State",
            cell: row => <i>{row.getValue()}</i>,
            filterType: "STRING",
            enableColumnFilter: false,
        },
        {
            id: 'Details',
            accessorKey: 'Details',
            header: "Details" ,
            cell: (({ row }) => {
                return (<div className="text-center"><Button className='otjs-button otjs-button-blue'
                    onClick={() => {row.toggleExpanded()}}>Details</Button></div>)
            }),
            enableColumnFilter: false,
        },
        {
            id: 'Actions',
            accessorKey: 'Actions',
            header: "Actions",
            cell: (({ row }) => {
                return dropDown(row.original.ID)
            }),
            enableColumnFilter: false,
        }
    ]
    
    const renderSubComponent = ({row}) => {
        return <ModalDetailsV8 data={[row.original]} />
    }

    return (
        <div >
            <CommonTableV8 columns={columnsJobs} data={data} canSort paginated canExpand renderSubComponent={renderSubComponent}/>
        </div>
    )
}