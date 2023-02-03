import React, {useMemo} from "react";
import apis from "../../../services/apis";
import { Button } from "react-bootstrap";
import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";


export default ({users, onUserUpdate, modify, setDelete}) => {

    const data = useMemo(() => users, [users]);

    const columns = [
        {
            id: 'id',
            accessorKey: 'id',
            header: 'ID',
            hiddenState: true
        }, {
            id : 'username',
            accessorKey: 'username',
            header: "Username",
            enableColumnFilter: true,
            //cell: InputCell,
        },
        {
            id : 'firstname',
            accessorKey: 'firstname',
            header: "First name",
            enableColumnFilter: true,
            //cell: InputCe
        }, 
        {
            id : 'lastname',
            accessorKey: 'lastname',
            header: "Last name",
            enableColumnFilter: true,
            //cell: InputCell
        }, 
        {
            id : 'email',
            accessorKey: 'email',
            header: "E-mail",
            enableColumnFilter: true,
            //cell: InputCell,
        },
        {
            id : 'role',
            accessorKey: 'role',
            header: "Role",
            enableColumnFilter: true,
            //cell: SelectCell,
            options: () => apis.role.getRoles().then(res => res.map((role) => ({value: role.name, label: role.name}))),
        }, 
        {
            id : 'password',
            accessorKey: 'password',
            header: "New Password",
            type : "password",
            //cell: InputCell,
        },
        {
            id : 'superAdmin',
            accessorKey: 'superAdmin',
            header: "Super Admin",
            // cell: SelectCell,
            options: async () => [{value: true, label: 'Yes'}, {value: false, label: 'No'}],
        },
        {
            id : 'edit',
            accessorKey: 'edit',
            header: "Edit",
            cell: ({row}) => {
                return (<Button name='edit' className='otjs-button otjs-button-green' onClick={() => {
                    modify(row.values)
                }}>Save</Button>)
            },
        },
        {
            id : 'delete',
            accessorKey: 'delete',
            header: "Delete",
            cell: ({row}) => {
                return ( <Button name='delete' className='otjs-button otjs-button-red'
                               onClick={() => setDelete(row.values.username, row.values.userId)}>Delete</Button>)
            }
        }
    ];

    return <CommonTableV8 data={data} columns={columns} />
}