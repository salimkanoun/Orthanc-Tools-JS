import React, { Component, Fragment } from 'react'
import Toggle from 'react-toggle'

class RoleForm extends Component {

    static defaultProps = {
        data: {
            import: false, 
            content: false, 
            anon: false, 
            export_local: false, 
            export_extern: false, 
            query: false,
            auto_query: false, 
            delete: false, 
            admin: false, 
            modify: false 
        }
    }

    state = {
        import: this.props.data.import, 
        content: this.props.data.content, 
        anon: this.props.data.anon, 
        exportLocal: this.props.data.export_local, 
        exportExtern: this.props.data.export_extern, 
        query: this.props.data.query,
        autoQuery: this.props.data.auto_query, 
        delete: this.props.data.delete, 
        admin: this.props.data.admin, 
        modify: this.props.data.modify 
    }

    constructor(props) {
        super(props);
        this.getState = this.getState.bind(this)
    }

    getState(){
        return this.state
    }

    render() {
        return (
            <Fragment>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Administration</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.admin} onChange={()=>this.setState(prevState => ({admin: !prevState.admin}))} />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Anonymisation</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.anon} onChange={()=>this.setState(prevState => ({anon: !prevState.anon}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Auto-Query</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.autoQuery} onChange={()=>this.setState(prevState => ({autoQuery: !prevState.autoQuery}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Content</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.content} onChange={()=>this.setState(prevState => ({content: !prevState.content}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Delete</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.delete} onChange={()=>this.setState(prevState => ({delete: !prevState.delete}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Local Export</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.exportLocal} onChange={()=>this.setState(prevState => ({exportLocal: !prevState.exportLocal}))}/>  
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Remote Export</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.exportExtern} onChange={()=>this.setState(prevState => ({exportExtern: !prevState.exportExtern}))}/>  
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Query</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.query} onChange={()=>this.setState(prevState => ({query: !prevState.query}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Import</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.import} onChange={()=>this.setState(prevState => ({import: !prevState.import}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Modify</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.modify} onChange={()=>this.setState(prevState => ({modify: !prevState.modify}))}/>
                        </div>
                    </div>
            </Fragment>
        );
    }
}

export default RoleForm;