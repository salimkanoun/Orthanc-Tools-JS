import React from "react";
import { Button } from "react-bootstrap";

import apis from "../../../../services/apis";
import CommonTableV8 from "../../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";
import { keys } from "../../../../model/Constant";
import { useCustomMutation } from "../../../../services/ReactQuery/hooks";


export default ({ users, onEditClick }) => {

    const deleteUser = useCustomMutation(
        ({ username }) => apis.User.deleteUser(username),
        [[keys.USERS_KEY]]
    )

    const columns = [
        {
            id: 'username',
            accessorKey: 'username',
            header: "Username"
        },
        {
            id: 'firstname',
            accessorKey: 'firstname',
            header: "First name"
        },
        {
            id: 'lastname',
            accessorKey: 'lastname',
            header: "Last name"
        },
        {
            id: 'email',
            accessorKey: 'email',
            header: "E-mail"
        },
        {
            id: 'role',
            accessorKey: 'role',
            header: "Role"
        },
        {
            id: 'superAdmin',
            accessorKey: 'superAdmin',
            header: "Super Admin",
            cell: ({ getValue }) => (
                <input type="checkbox" disabled={true} checked={getValue()} />
            )
        },
        {
            id: 'edit',
            accessorKey: 'edit',
            header: "Edit",
            cell: ({ row }) => (
                <Button className='otjs-button otjs-button-green'
                    onClick={() => onEditClick(row.original.username)}>Modify</Button>
            ),
        },
        {
            id: 'delete',
            accessorKey: 'delete',
            header: "Delete",
            cell: ({ row }) => (
                <Button name='delete' className='otjs-button otjs-button-red'
                    onClick={() => deleteUser.mutate({ username: row.original.username })}>Delete</Button>
            )
        }
    ];

    return (
        <>
            <CommonTableV8 data={users} canSort columns={columns} />
        </>
    )

}