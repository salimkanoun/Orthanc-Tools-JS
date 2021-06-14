import Select from 'react-select';
import {Component} from 'react';
import apis from "../../services/apis";

/**
 * To use it to edit AETs choice, pass an Array of AETs Name through the props named 'aets'
 */
export default class AETSelect extends Component{

    state = {
        selected: [],
        label:this.props.label,
        options: [],
    }

    componentDidMount = async () => {
      //get AETs    
      let aets = await apis.aets.getAets()
      for(var i = 0;i<aets.length;i++){
        aets[i]={value:aets[i],label:aets[i]}
      }
      if(this.props.aets){ //added for making this select bar available for modify destinations
        let selected = []
        let aets = this.props.aets || []
        for(let i=0;i<aets.length;i++){
          selected.push({value:aets[i],label:aets[i]})
        }
        this.setState({selected:selected})
      }
      this.setState({
          options:aets
      })
    }

    /**
     * When the value of the selector change
     * @param {Array.<JSON>} value new value of the selected array
     */
    handleOnChange = async (value) => {

        var selected = this.state.selected
        var difference = []
        if(value.length<selected.length){
            for(let i = 0;i<selected.length;i++){
                if(!(value.includes(selected[i]))){
                    difference.push(selected[i])
                }
            }
        }
        else if(value.length>selected.length){
            for(let i = 0;i<value.length;i++){
                if(!(selected.includes(value[i]))){
                    difference.push(value[i])
                }
            }
        }else{
            console.error('Selector Change Error : Selected Values didn\'t change')
        }
        this.props.refresh(value)
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