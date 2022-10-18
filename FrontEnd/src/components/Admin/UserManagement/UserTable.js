import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";
import React, {useMemo} from "react";
import {InputCell, SelectCell} from "../../CommonComponents/RessourcesDisplay/ReactTable/EditableCells";
import apis from "../../../services/apis";
import { Button } from "react-bootstrap";


export default ({users, onUserUpdate, modify, setDelete}) => {
    const columns = useMemo(() => [
        {
            accessor: 'id',
            hidden: true
        }, {
            accessor: 'username',
            Header: 'Username',
            sort: true,
            Cell: InputCell
        }, {
            accessor: 'firstname',
            Header: 'First name',
            sort: true,
            Cell: InputCell
        }, {
            accessor: 'lastname',
            Header: 'Last name',
            sort: true,
            Cell: InputCell
        }, {
            accessor: 'email',
            Header: 'E-Mail',
            sort: true,
            Cell: InputCell
        }, {
            accessor: 'role',
            Header: 'Role',
            sort: true,
            options: () => apis.role.getRoles().then(res => res.map((role) => ({value: role.name, label: role.name}))),
            Cell: SelectCell
        }, {
            accessor: 'password',
            Header: 'New Password',
            type: 'password',
            Cell: InputCell
        }, {
            accessor: 'superAdmin',
            Header: 'Super Admin',
            options: async () => [{value: true, label: 'Yes'}, {value: false, label: 'No'}],
            Cell: SelectCell
        }, {
            id: 'edit',
            Header: 'Edit',
            editable: false,
            Cell: ({row}) => {
                return <Button name='edit' className='otjs-button otjs-button-green' onClick={() => {
                    modify(row.values)
                }}>Save</Button>
            }
        }, {
            id: 'delete',
            Header: 'Delete',
            editable: false,
            Cell: ({row}) => {
                return <Button name='delete' className='otjs-button otjs-button-red'
                               onClick={() => setDelete(row.values.username, row.values.userId)}>Delete</Button>
            }
        }
    ], [modify, setDelete]);

    const data = useMemo(() => users, [users]);
    return <CommonTable data={data} columns={columns} onDataChange={onUserUpdate} pagination={true}/>
}