import Select from 'react-select';
import {Component} from 'react';
import apis from "../../../services/apis";

export default class RoleSelect extends Component{


    state = {
        selected: [],
        label:this.props.label,
        options: [],
    }

    componentDidMount = async () => {
        let roles = await apis.role.getRoles()
        for(var i = 0; i < roles.length; i++){
            roles[i].value=roles[i].name
            roles[i].label=roles[i].value
        }

        let selectedRoles = await apis.rolelabel.getLabelRoles(this.props.label)
        for(var j = 0; j < selectedRoles.length; j++){
            selectedRoles[j].value=selectedRoles[j].role_name
            selectedRoles[j].label=selectedRoles[j].value
        }
        this.setState({
            options:roles,
            selected:selectedRoles
        })
    }

    handleOnChange = async (value) => {

        var selected = this.state.selected
        var difference = []
        if(value.length<selected.length){
            for(let i = 0;i<selected.length;i++){
                if(!(value.includes(selected[i]))){
                    difference.push(selected[i])
                }
            }
            console.log('removed role: ',difference[0].value,' | to label: ',this.state.label)
            await apis.rolelabel.deleteRoleLabel(this.props.username,difference[0].value,this.state.label)
        }
        else if(value.length>selected.length){
            for(let i = 0;i<value.length;i++){
                if(!(selected.includes(value[i]))){
                    difference.push(value[i])
                }
            }
            console.log('added role:',difference[0].value,' | to label: ',this.state.label)
            await apis.rolelabel.createRoleLabel(this.props.username,difference[0].value,this.state.label)
        }else{
            console.error('Selector Change Error : Selected Values didn\'t change')
        }
        this.setState({ selected: value });
    }

    choiceStyle = {
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

    render() {
        return (
            <div>
            <Select
                closeMenuOnSelect={false}
                isMulti
                options={this.state.options}
                onChange={this.handleOnChange.bind(this)}
                value={this.state.selected}
                style={ this.choiceStyle}
            />
            </div>
        );
    }
}