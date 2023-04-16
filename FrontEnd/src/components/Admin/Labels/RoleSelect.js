import Select from 'react-select';
import { useEffect, useState } from 'react';
import apis from "../../../services/apis";
import SelectRoles from '../UserManagement/SelectRoles';
import { useCustomQuery } from '../../CommonComponents/ReactQuery/hooks';
import { keys } from '../../../model/Constant';

export default ({ labelName, username }) => {

    const [selected, setSelected] = useState([])
    const [options, setOptions] = useState([])

    const { data: labelRole } = useCustomQuery([keys.LABELS_KEY, labelName],
        () => apis.rolelabel.getLabelRoles(labelName)
    )

    const handleOnChange = async (value) => {

        var selected = selected
        var difference = []
        if (value.length < selected.length) {
            for (let i = 0; i < selected.length; i++) {
                if (!(value.includes(selected[i]))) {
                    difference.push(selected[i])
                }
            }
            console.log('removed role: ', difference[0].value, ' | to label: ', labelName)
            await apis.rolelabel.deleteRoleLabel(username, difference[0].value, labelName)
        }
        else if (value.length > selected.length) {
            for (let i = 0; i < value.length; i++) {
                if (!(selected.includes(value[i]))) {
                    difference.push(value[i])
                }
            }
            console.log('added role:', difference[0].value, ' | to label: ', labelName)
            await apis.rolelabel.createRoleLabel(username, difference[0].value, labelName)
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
            <SelectRoles />
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