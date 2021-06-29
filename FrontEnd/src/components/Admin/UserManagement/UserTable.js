import CommonTable from "../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable";
import React, {useMemo} from "react";
import AsyncSelect from "react-select/async";
import apis from "../../../services/apis";
import role from "../../../services/role";


function InputCell({
                       value: initialValue,
                       row: {values},
                       column: {id, accessor, type},
                       onDataChange,
                   }) {
    type = type || 'text'

    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
    const [toggled, setToggled] = React.useState(false)

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue]);


    const onChange = e => {
        setValue(e.target.value)
    }

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        setToggled(false);
        if (onDataChange) onDataChange(initialValue, value, values, id || accessor)
    }

    return toggled ? <input autoFocus={true} type={type} value={value} onChange={onChange} onBlur={onBlur}
        /> :
        <div style={{'min-height': '40px', 'min-width': '50px', padding: 0}}
             onClick={() => setToggled(true)}>
            <p>{value}</p>
        </div>

}

function SelectCell({
                        value: initialValue,
                        row: {values},
                        column: {id, accessor, options},
                        onDataChange, // This is a custom function that we supplied to our table instance
                    }) {

    const [value, setValue] = React.useState(null);

    const onChange = value => {
        setValue(value);
        if (onDataChange) onDataChange(initialValue, value.value, values, id || accessor)
    }

    return <AsyncSelect single defaultOptions value={value}
                        loadOptions={() => options().then(res => {
                            setValue(res.find(x => x.value === initialValue))
                            return res;
                        })} onChange={onChange}
                        style={{'min-width': '100px'}}/>

}

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
                return <button type='button' name='edit' className='btn btn-warning' onClick={() => {
                    modify(row.values)
                }}>Save</button>
            }
        }, {
            id: 'delete',
            Header: 'Delete',
            editable: false,
            Cell: ({row}) => {
                return <button type='button' name='delete' className='btn btn-danger'
                               onClick={() => setDelete(row.values.username, row.values.userId)}>Delete</button>
            }
        }
    ], [modify, setDelete]);

    const data = useMemo(() => users, [users]);
    return <CommonTable tableData={data} columns={columns} onDataChange={onUserUpdate}/>
}