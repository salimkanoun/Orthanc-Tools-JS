import React, { Component } from "react"
import Select from "react-select";

class Roles extends Component {

    state = { 
            data: {
                upload: true, 
                content: true, 
                anon: true, 
                export: true, 
                query: true,
                autoQuery: true, 
                delete: true, 
                admin: true
            }
         };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
    }

    roles = [
        {label: 'Admin', value: 'admin'}, 
        {label: 'User', value: 'user'}
    ]

    handleChange(val){ 
        switch (val.value){
            case 'admin': 
                this.setState({
                    data: {
                        upload: true, 
                        content: true, 
                        anon: true, 
                        export: true, 
                        query: true,
                        autoQuery: true, 
                        delete: true, 
                        admin: true
                    }
                })
                break
            case 'user':
                this.setState({
                    data: {
                        upload: true, 
                        content: true, 
                        anon: true, 
                        export: true, 
                        query: true,
                        autoQuery: true, 
                        delete: true, 
                        admin: false
                    }
                })
                break
            default: 
                break
        }
    }

    render() {
        return (
            <div className='jumbotron'>
                <h2 className='card-title mb-5'>User Roles</h2>
                <div className="row-md mb-4">
                    <div className='col-md-4'>
                        <Select single options={this.roles} onChange={this.handleChange}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-lg'>
                        <h5>Administration</h5>
                    </div>
                    <div className='col-sm'>
                        <input type="checkbox" checked={this.state.data.admin} onChange={()=>this.setState({data: {...this.state.data, admin: !this.state.data.admin}})}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-lg'>
                        <h5>Anonymisation</h5>
                    </div>
                    <div className='col-sm'>
                        <input type="checkbox" checked={this.state.data.anon} onChange={()=>this.setState({data: {...this.state.data, anon: !this.state.data.anon}})}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-lg'>
                        <h5>Auto-Query</h5>
                    </div>
                    <div className='col-sm'>
                        <input type="checkbox" checked={this.state.data.autoQuery} onChange={()=>this.setState({data: {...this.state.data, autoQuery: !this.state.data.autoQuery}})}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-lg'>
                        <h5>Content</h5>
                    </div>
                    <div className='col-sm'>
                        <input type="checkbox" checked={this.state.data.content} onChange={()=>this.setState({data: {...this.state.data, content: !this.state.data.content}})}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-lg'>
                        <h5>Delete</h5>
                    </div>
                    <div className='col-sm'>
                        <input type="checkbox" checked={this.state.data.delete} onChange={()=>this.setState({data: {...this.state.data, delete: !this.state.data.delete}})}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-lg'>
                        <h5>Export</h5>
                    </div>
                    <div className='col-sm'>
                        <input type="checkbox" checked={this.state.data.export} onChange={()=>this.setState({data: {...this.state.data, export: !this.state.data.export}})}/>  
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-lg'>
                        <h5>Query</h5>
                    </div>
                    <div className='col-sm'>
                        <input type="checkbox" checked={this.state.data.query} onChange={()=>this.setState({data: {...this.state.data, query: !this.state.data.query}})}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-lg'>
                        <h5>Upload</h5>
                    </div>
                    <div className='col-sm'>
                        <input type="checkbox" checked={this.state.data.upload} onChange={()=>this.setState({data: {...this.state.data, upload: !this.state.data.upload}})}/>
                    </div>
                </div>
                <button className='btn btn-primary float-right' type='button' onClick={()=>alert('not implemented yet')} >Send</button>
            </div>
        );
    }
}

export default Roles;