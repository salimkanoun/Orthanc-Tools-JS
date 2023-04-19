import Select from 'react-select';
import Spinner from '../../CommonComponents/Spinner';

import apis from "../../../services/apis";
import { errorMessage, successMessage } from '../../../tools/toastify';
import { keys } from '../../../model/Constant';
import { useCustomMutation, useCustomQuery } from '../../../services/ReactQuery/hooks';

export default ({ labelName }) => {

    const { data: optionRoles, isLoading: isLoadingAllRoles } = useCustomQuery(
        [keys.ROLES_KEY],
        () => apis.role.getRoles(),
        undefined,
        (answer) => {
            return answer.map((role) => {
                return ({
                    value: role.name,
                    label: role.name
                })
            })
        }
    )

    const { data: labelRoleOptions, isLoading: isLoadingRoles } = useCustomQuery(
        [keys.LABELS_KEY, labelName],
        () => apis.rolelabel.getLabelRoles(labelName),
        undefined,
        (data) => data.map(role => ({ label: role, value: role }))
    )

    const mutateDeleteRoleLabel = useCustomMutation(
        ({ roleName, labelName }) => apis.rolelabel.deleteRoleLabel(roleName, labelName),
        [[keys.LABELS_KEY, labelName]],
        () => successMessage('Role Removed'),
        (error) => errorMessage(error?.data?.errorMessage, 'Failed')
    )

    const createRoleLabel = useCustomMutation(
        ({ roleName, labelName }) => apis.rolelabel.createRoleLabel(roleName, labelName),
        [[keys.LABELS_KEY, labelName]],
        () => successMessage('Role Added'),
        (error) => errorMessage(error?.data?.errorMessage, 'Failed')
    )

    const handleOnChange = (value, metadata) => {
        if(metadata.action === "remove-value"){
            mutateDeleteRoleLabel.mutate({labelName : labelName, roleName : metadata.removedValue.value})
        }
        if(metadata.action ==="select-option"){
            createRoleLabel.mutate({labelName : labelName, roleName : metadata.option.value})
        }
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

    if (isLoadingAllRoles || isLoadingRoles) return <Spinner />

    return (
        <Select
            closeMenuOnSelect={false}
            isMulti
            options={optionRoles}
            value={labelRoleOptions}
            style={choiceStyle}
            onChange = {handleOnChange}
            isClearable = {false}
        />
    );
}