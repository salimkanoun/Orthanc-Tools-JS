import React from 'react'
import { Button } from 'react-bootstrap';

import apis from '../../../services/apis';
import CommonTableV8 from '../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8';
import { keys } from '../../../model/Constant'
import { useCustomMutation } from '../../../services/ReactQuery/hooks';
import { errorMessage, successMessage } from '../../../tools/toastify';

/**
 * Table with known AETs details with Echo and Remove button
 */
export default ({ aetsData = [] }) => {

    const deleteAet = useCustomMutation(
        ({ name }) => apis.aets.deleteAet(name),
        [[keys.AETS_KEY]]
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
                                .then(() => { successMessage(name + ' Success') })
                                .catch(() => { errorMessage(name + ' Echo Failure') })
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