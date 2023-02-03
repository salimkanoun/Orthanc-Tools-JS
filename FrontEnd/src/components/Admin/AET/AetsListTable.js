import React, { Fragment, useMemo } from 'react'
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import apis from '../../../services/apis';
import CommonTableV8 from '../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8';

/**
 * Table with known AETs details with Echo and Remove button
 */
export default ({ aetsData, refreshAetData }) => {

    const data = useMemo(() => Object.entries(aetsData).map(([name, data]) => ({
        name,
        ...data
    })), [aetsData]);

    const columns = [
        {
            id: 'name',
            accessorKey: 'name',
            header: 'Name'
        }, {
            id: 'AET',
            accessorKey: 'AET',
            header: 'AET'
        }, {
            id: 'host',
            accessorKey: 'Host',
            header: 'Host'
        }, {
            id: 'Port',
            accessorKey: 'Port',
            header: 'Port'
        }, {
            id: 'Manufacturer',
            accessorKey: 'Manufacturer',
            header: 'Manufacturer'
        }, {
            id: 'echo',
            accessorKey: 'echo',
            header: 'Echo AET',
            cell: (({ row }) => {
                return (<div className="text-center"><Button className='otjs-button otjs-button-blue'
                    onClick={async () => {
                        try {
                            await apis.aets.echoAet(row.values.name)
                            toast.success(row.values.name + ' Success', { data: { type: 'notification' } })
                        } catch (error) {
                            toast.error(row.values.name + ' Echo Failure', { data: { type: 'notification' } })
                        }

                    }} > Echo </Button>
                </div>)
            })
        }, {
            id: 'remove',
            accessorKey: 'remove',
            header: 'Remove AET',
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        <input type="button" className='otjs-button otjs-button-red' onClick={async () => {
                            try {
                                await apis.aets.deleteAet(row.values.name);
                                refreshAetData()
                            } catch (error) {
                                toast.error(error.statusText, { data: { type: 'notification' } })
                            }
                        }} value="Remove" />
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
            <CommonTableV8 data={data} columns={columns} />
        </Fragment>
    )
}