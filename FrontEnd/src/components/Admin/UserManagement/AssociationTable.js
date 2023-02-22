import React from "react";
import { Button } from "react-bootstrap";
import { keys } from "../../../model/Constant";
import apis from "../../../services/apis";
import { useCustomMutation } from "../../CommonComponents/ReactQuery/hooks";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";

export default ({associations}) => {
    
    const deleteAssociation = useCustomMutation(
        ({ldapGroup}) => apis.ldap.deleteMatch(ldapGroup),
        [[keys.ASSOCIATIONS_KEY]]
    )

    const columns = [
        {
            id : 'ldapGroup',
            accessorKey: 'ldapGroup',
            header: 'Group name',
            sort: true
        }, {
            id : 'localRole',
            accessorKey: 'localRole',
            header: 'Associed role',
        }, {
            id : 'delete',
            accessorKey: 'delete',
            header: 'Delete',
            Cell: ({ row }) => {
                return <Button name='delete' className='btn btn-danger' onClick={() => {
                    deleteAssociation.mutate(row.values.ldapGroup)
                }}>Delete</Button>
            }
        }
    ];

    return <CommonTableV8 data={associations} columns={columns} />
}