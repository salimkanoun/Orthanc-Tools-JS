import React, {useMemo, useState} from "react";
import apis from "../../../../services/apis";
import { Button } from "react-bootstrap";
import CommonTableV8 from "../../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";
import { useCustomMutation } from "../../../CommonComponents/ReactQuery/hooks";
import { keys } from "../../../../model/Constant";
import UserForm from "./UserForm";


export default ({users, roles}) => {

    const [show, setShow] = useState(false)
    const [currentRow, setCurrentRow] = useState(null)

    const modify = useCustomMutation(
        (username, firstname, lastname, email, role, password, superAdmin) => apis.User.modifyUser(username, firstname, lastname, email, role, password, superAdmin),
        [[keys.USERS_KEY]]
    )

    const modifyUser = (state, role) => {
        modify.mutate(state.username, state.firstname, state.lastname, state.email, role, state.password, state.superAdmin)
    }

    const deleteUser = useCustomMutation(
        ({username}) =>  apis.User.deleteUser(username),
        [[keys.USERS_KEY]]
    )

    const data = useMemo(() => users, [users]);

    const columns = [
        {
            id: 'id',
            accessorKey: 'id',
            header: 'ID',
            hidden: true
        }, {
            id : 'username',
            accessorKey: 'username',
            header: "Username",
            enableColumnFilter: true,
        },
        {
            id : 'firstname',
            accessorKey: 'firstname',
            header: "First name",
            enableColumnFilter: true,
        }, 
        {
            id : 'lastname',
            accessorKey: 'lastname',
            header: "Last name",
            enableColumnFilter: true,
        }, 
        {
            id : 'email',
            accessorKey: 'email',
            header: "E-mail",
            enableColumnFilter: true,
        },
        {
            id : 'role',
            accessorKey: 'role',
            header: "Role",
            enableColumnFilter: true,
            /*isEditable : true,
            editionProperties : {
                type : 'SELECT',
                options: roles.map((role) => ({value: role, label: role}))
            }*/
        }, 
        {
            id : 'password',
            accessorKey: 'password',
            header: "New Password",
            type : "password",
        },
        {
            id : 'superAdmin',
            accessorKey: 'superAdmin',
            header: "Super Admin",
            options: async () => [{value: true, label: 'Yes'}, {value: false, label: 'No'}],
        },
        {
            id : 'edit',
            accessorKey: 'edit',
            header: "Edit",
            cell: ({row}) => {
                return (<Button className='otjs-button otjs-button-green' onClick={() => {
                    setShow(true)
                    setCurrentRow(row.original)
                    console.log(currentRow)
                }}>Modify</Button>)
            },
        },
        {
            id : 'delete',
            accessorKey: 'delete',
            header: "Delete",
            cell: ({row}) => {
                return ( <Button name='delete' className='otjs-button otjs-button-red'
                               onClick={() => deleteUser(row.values.username)}>Delete</Button>)
            }
        }
    ];

    const cellEditHandler = (rowId, column, value) => {
        console.log(rowId, column, value)
    }

    return <>
    
    <CommonTableV8 onCellEdit={cellEditHandler} data={data} columns={columns} />
    </>
    
}