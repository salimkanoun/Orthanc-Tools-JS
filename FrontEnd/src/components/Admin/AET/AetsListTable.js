import React, {Fragment, useMemo} from 'react'
import {toast} from 'react-toastify';
import apis from '../../../services/apis';
import CommonTableV8 from '../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8';

/**
 * Table with known AETs details with Echo and Remove button
 */
export default ({aetsData, refreshAetData}) => {

    const data = useMemo(() => Object.entries(aetsData).map(([name, data]) => ({
        name,
        ...data
    })), [aetsData]);

    const columns = [
    {
        id : 'name',
        accessoryKey: 'name',
        header: 'Name'
    }, {
        id: 'AET',
        accessoryKey: 'AET',
        header: 'AET'
    }, {
        id : 'host',
        accessoryKey: 'Host',
        header: 'Host'
    }, {
        id : 'Port',
        accessoryKey: 'Port',
        header: 'Port'
    }, {
        id : 'Manufacturer',
        accessoryKey: 'Manufacturer',
        header: 'Manufacturer'
    }, {
        id : 'echo',
        accessoryKey: 'echo',
        header: 'Echo AET',
        Cell: ({row}) => {
            return (<div className="text-center">
                <input type="button" className='otjs-button otjs-button-blue' onClick={async () => {
                    try {
                        await apis.aets.echoAet(row.values.name)
                        toast.success(row.values.name + ' Success', {data:{type:'notification'}})
                    } catch (error) {
                        toast.error(row.values.name + ' Echo Failure', {data:{type:'notification'}})
                    }

                }} value="Echo"/>
            </div>)
        }
    }, {
        id : 'remove',
        accessoryKey: 'remove',
        header: 'Remove AET',
        Cell: ({row}) => {
            return (
                <div className="text-center">
                    <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                        try {
                            await apis.aets.deleteAet(row.values.name);
                            refreshAetData()
                        } catch (error) {
                            toast.error(error.statusText, {data:{type:'notification'}})
                        }
                    }} value="Remove"/>
                </div>)
        },
        formatExtraData: this
    }]
    ;

    /**
     * Translate Orthanc API in array of Rows to be consumed by BootstrapTable
     */

    return (
        <Fragment>
            <CommonTableV8 data={data} columns={columns}/>
        </Fragment>
    )
}