import React, {Fragment, useMemo} from 'react'
import {toast} from 'react-toastify';
import apis from '../../../services/apis';
import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";

/**
 * Table with known AETs details with Echo and Remove button
 */
export default function Aet({aetsData, refreshAetData}) {

    const columns = useMemo(() => [{
        accessor: 'name',
        Header: 'Name'
    }, {
        accessor: 'AET',
        Header: 'AET'
    }, {
        accessor: 'Host',
        Header: 'Host'
    }, {
        accessor: 'Port',
        Header: 'Port'
    }, {
        accessor: 'Manufacturer',
        Header: 'Manufacturer'
    }, {
        accessor: 'echo',
        Header: 'Echo AET',
        Cell: ({row}) => {
            return (<div className="text-center">
                <input type="button" className='otjs-button otjs-button-blue' onClick={async () => {
                    try {
                        await apis.aets.echoAet(row.values.name)
                        toast.success(row.values.name + ' Success')
                    } catch (error) {
                        toast.error(row.values.name + ' Echo Failure')
                    }

                }} value="Echo"/>
            </div>)
        }
    }, {
        accessor: 'remove',
        Header: 'Remove AET',
        Cell: ({row}) => {
            return (
                <div className="text-center">
                    <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                        try {
                            await apis.aets.deleteAet(row.values.name);
                            refreshAetData()
                        } catch (error) {
                            toast.error(error.statusText)
                        }
                    }} value="Remove"/>
                </div>)
        },
        formatExtraData: this
    }], [refreshAetData]);

    /**
     * Translate Orthanc API in array of Rows to be consumed by BootstrapTable
     */
    const data = useMemo(() => Object.entries(aetsData).map(([name, data]) => ({
        name,
        ...data
    })), [aetsData]);

    return (
        <Fragment>
            <CommonTable tableData={data} columns={columns}/>
        </Fragment>
    )
}