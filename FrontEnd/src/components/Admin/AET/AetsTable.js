import React from 'react'
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import apis from '../../../services/apis';
import { useCustomMutation } from '../../CommonComponents/ReactQuery/hooks';
import CommonTableV8 from '../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8';

/**
 * Table with known AETs details with Echo and Remove button
 */
export default ({ aetsData }) => {

    const deleteAet = useCustomMutation(
        ({ name }) => apis.aets.deleteAet(name),
        [['aets']]
    )

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
                return (
                    <Button className='otjs-button otjs-button-blue'
                        onClick={() => {
                            const name = row.original.name
                            apis.aets.echoAet(name)
                                .then(() => { toast.success(name + ' Success', { data: { type: 'notification' } }) })
                                .catch(() => { toast.error(name + ' Echo Failure', { data: { type: 'notification' } }) })
                        }} >
                        Echo
                    </Button>
                )
            })
        },
        {
            id: 'remove',
            accessorKey: 'remove',
            header: 'Remove AET',
            cell: ({ row }) => {
                return (
                    <Button className='otjs-button otjs-button-red' onClick={() => {
                        const name = row.original.name
                        deleteAet.mutate({ name })
                    }}  >
                        Remove
                    </Button>
                )
            },
            formatExtraData: this
        }]
        ;

    /**
     * Translate Orthanc API in array of Rows to be consumed by BootstrapTable
     */
    return (
        <CommonTableV8 data={aetsData} columns={columns} />
    )
}