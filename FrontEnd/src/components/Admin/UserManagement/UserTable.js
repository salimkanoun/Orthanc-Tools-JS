import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";
import React, {useMemo} from "react";
import {InputCell, SelectCell} from "../../CommonComponents/RessourcesDisplay/ReactTable/EditableCells";
import apis from "../../../services/apis";


export default function UserTable({
                                      users, onUserUpdate, modify, setDelete
                                  }
) {
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
            Header: 'Tên',
            sort: true,
            Cell: InputCell
        }, {
            accessor: 'lastname',
            Header: 'Họ',
            sort: true,
            Cell: InputCell
        }, {
            accessor: 'email',
            Header: 'E-Mail',
            sort: true,
            Cell: InputCell
        }, {
            accessor: 'role',
            Header: 'Vai trò',
            sort: true,
            options: () => apis.role.getRoles().then(res => res.map((role) => ({value: role.name, label: role.name}))),
            Cell: SelectCell
        }, {
            accessor: 'password',
            Header: 'Mật khẩu mới',
            type: 'password',
            Cell: InputCell
        }, {
            accessor: 'superAdmin',
            Header: 'Super Admin',
            options: async () => [{value: true, label: 'Yes'}, {value: false, label: 'No'}],
            Cell: SelectCell
        }, {
            id: 'edit',
            Header: 'Sửa',
            editable: false,
            Cell: ({row}) => {
                return <button type='button' name='edit' className='otjs-button otjs-button-green' onClick={() => {
                    modify(row.values)
                }}>Lưu</button>
            }
        }, {
            id: 'delete',
            Header: 'Xóa',
            editable: false,
            Cell: ({row}) => {
                return <button type='button' name='delete' className='otjs-button otjs-button-red'
                               onClick={() => setDelete(row.values.username, row.values.userId)}>Xóa</button>
            }
        }
    ], [modify, setDelete]);

    const data = useMemo(() => users, [users]);
    return <CommonTable tableData={data} columns={columns} onDataChange={onUserUpdate} pagination={true}/>
}