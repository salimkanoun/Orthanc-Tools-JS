import Select from 'react-select';
import { useEffect, useState } from 'react';
import apis from "../../../services/apis";

export default ({ labelProps, username }) => {

    const [selected, setSelected] = useState([])
    const [label, setLabel] = useState(labelProps)
    const [options, setOptions] = useState([])

    useEffect(() => {
        const getRoles = async () => {await apis.role.getRoles()}
        let roles = getRoles()
        for (var i = 0; i < roles.length; i++) {
            roles[i].value = roles[i].name
            roles[i].label = roles[i].value
        }

        const getLabelRoles = async () => {await apis.rolelabel.getLabelRoles(label)}
        let selectedRoles = getLabelRoles()
        for (var j = 0; j < selectedRoles.length; j++) {
            selectedRoles[j].value = selectedRoles[j].role_name
            selectedRoles[j].label = selectedRoles[j].value
        }
        setOptions(roles)
        setSelected(selectedRoles)
    }, []);


    const handleOnChange = async (value) => {

        var selected = selected
        var difference = []
        if (value.length < selected.length) {
            for (let i = 0; i < selected.length; i++) {
                if (!(value.includes(selected[i]))) {
                    difference.push(selected[i])
                }
            }
            console.log('removed role: ', difference[0].value, ' | to label: ', label)
            await apis.rolelabel.deleteRoleLabel(username, difference[0].value, label)
        }
        else if (value.length > selected.length) {
            for (let i = 0; i < value.length; i++) {
                if (!(selected.includes(value[i]))) {
                    difference.push(value[i])
                }
            }
            console.log('added role:', difference[0].value, ' | to label: ', label)
            await apis.rolelabel.createRoleLabel(username, difference[0].value, label)
        } else {
            console.error('Selector Change Error : Selected Values didn\'t change')
        }
        setSelected(value)
    }

    const choiceStyle = {
        control: styles => ({ ...styles, backgroundColor: 'white' }),
        multiValue: (styles) => {
            return {
                ...styles,
            };
        },
        multiValueLabel: (styles) => ({
            ...styles,
        }),
        multiValueRemove: (styles => ({
            ...styles,
        }))
    };

    return (
        <div>
            <Select
                closeMenuOnSelect={false}
                isMulti
                options={options}
                onChange={handleOnChange.bind(this)}
                value={selected}
                style={choiceStyle}
            />
        </div>
    );
}