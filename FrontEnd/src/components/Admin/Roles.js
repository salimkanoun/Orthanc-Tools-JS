import React, { Component } from "react"
import Select from "react-select";
import Toggle from 'react-toggle'

class Roles extends Component {

    state = { 
            data: {
                upload: true, 
                content: true, 
                anon: true, 
                exportLocal: true, 
                exportExtern: true, 
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
                        exportLocal: true, 
                        exportExtern: true, 
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
                        exportLocal: true, 
                        exportExtern: true, 
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
                <h2 className='card-title mb-4'>User Roles</h2>
                <div className="row-md mb-4">
                    <div className='col-md-4'>
                        <Select single options={this.roles} onChange={this.handleChange}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-2'>
                        <h5>Administration</h5>
                    </div>
                    <div className='col-sm'>
                        <Toggle checked={this.state.data.admin} onChange={()=>this.setState(prevState => ({data: {...prevState.data, admin: !prevState.data.admin}}))} />
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-2'>
                        <h5>Anonymisation</h5>
                    </div>
                    <div className='col-sm'>
                        <Toggle checked={this.state.data.anon} onChange={()=>this.setState(prevState => ({data: {...prevState.data, anon: !prevState.data.anon}}))}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-2'>
                        <h5>Auto-Query</h5>
                    </div>
                    <div className='col-sm'>
                        <Toggle checked={this.state.data.autoQuery} onChange={()=>this.setState(prevState => ({data: {...prevState.data, autoQuery: !prevState.data.autoQuery}}))}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-2'>
                        <h5>Content</h5>
                    </div>
                    <div className='col-sm'>
                        <Toggle checked={this.state.data.content} onChange={()=>this.setState(prevState => ({data: {...prevState.data, content: !prevState.data.content}}))}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-2'>
                        <h5>Delete</h5>
                    </div>
                    <div className='col-sm'>
                        <Toggle checked={this.state.data.delete} onChange={()=>this.setState(prevState => ({data: {...prevState.data, delete: !prevState.data.delete}}))}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-2'>
                        <h5>Export Local</h5>
                    </div>
                    <div className='col-sm'>
                        <Toggle checked={this.state.data.exportLocal} onChange={()=>this.setState(prevState => ({data: {...prevState.data, exportLocal: !prevState.data.exportLocal}}))}/>  
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-2'>
                        <h5>Export Extern</h5>
                    </div>
                    <div className='col-sm'>
                        <Toggle checked={this.state.data.exportExtern} onChange={()=>this.setState(prevState => ({data: {...prevState.data, exportExtern: !prevState.data.exportExtern}}))}/>  
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-2'>
                        <h5>Query</h5>
                    </div>
                    <div className='col-sm'>
                        <Toggle checked={this.state.data.query} onChange={()=>this.setState(prevState => ({data: {...prevState.data, query: !prevState.data.query}}))}/>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className='col-2'>
                        <h5>Upload</h5>
                    </div>
                    <div className='col-sm'>
                        <Toggle checked={this.state.data.upload} onChange={()=>this.setState(prevState => ({data: {...prevState.data, upload: !prevState.data.upload}}))}/>
                    </div>
                </div>
                <button className='btn btn-primary mt-2' type='button' onClick={()=>alert('not implemented yet')} >Send</button>
            </div>
        );
    }
}

export default Roles;