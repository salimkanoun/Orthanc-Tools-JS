// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
import React, {Component} from "react";
import {Dropdown, FormControl} from "react-bootstrap";
import apis from "../../../services/apis";

const CustomToggle = React.forwardRef(({onClick, onChange, onEnter}, ref) => {
    return (
        <div onKeyDown={(e) => {
            if (e.key === "Enter" && !!onEnter) onEnter();
        }}>
            <FormControl
                ref={ref}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}
                onChange={(e) => {
                    e.preventDefault();
                    onChange(e);
                }}
                placeholder={'Username'}
            />
        </div>
    )
});

export default class UserSelect extends Component {

    state = {
        value: '',
        show: false
    }

    componentDidMount() {
        apis.User.getUsers().then(users => {
            this.setState({users})
        });
    }

    handleChange = (event) => {
        this.setState({value: event.target.value, show: true});
    }

    handleSelect = (event) => {
        let val = this.props.users.filter(user => user.username === event)[0];
        if (val) {
            this.props.handleSelect(val);
        }
        this.setState({value: '', show: false});
    }

    handleEnter = () => {
        let val = this.props.users.filter(user => user.username === this.state.value)[0];
        if (val) {
            this.props.handleSelect(val);
        }
        this.setState({value: '', show: false});
    }

    handleClick = (event) => {
        this.setState({show: !this.state.show});
    }

    render() {
        let elements = this.props.users
            .filter(user => user.username.includes(this.state.value))
            .map(user => <Dropdown.Item eventKey={user.username}>{user.username}</Dropdown.Item>)

        return (
            <Dropdown onSelect={this.handleSelect} show={this.state.show}>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" onClick={this.handleClick}
                                 onChange={this.handleChange}
                                 onEnter={this.handleEnter}
                                 value={this.state.value}/>
                <Dropdown.Menu>
                    {elements}
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}