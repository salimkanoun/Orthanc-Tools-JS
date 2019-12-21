import React, { Component, Fragment } from 'react';
import FormInput from './form_input'

import TableQuery from './table_query'
import TableResult from './table_results'

import { connect } from 'react-redux'
import * as actions from '../actions'

class Query extends Component {

    activate(divName){
        this.props.setTab(divName)
    }


    async componentDidMount() {
        let aets= await Query.getAets();
        this.props.setAets(aets)
    }

    static async getAets(){
        let response= await fetch('/aets')
        let aets=[]
        if(response.ok){
        aets = await response.json()
        }

        return aets

    }

    render(){
        return(
            <Fragment>
                <div id="navBar" className="mb-5">
                    <ul className="nav nav-pills nav-fill">
                    <li className="nav-item">
                        <button className={this.props.currentMainTab ==='Query' ? "col nav-link active link-button" :  " col nav-link link-button"} onClick={()=>this.activate('Query')} >Add Query</button>
                    </li>
                    <li className="nav-item">
                        <button className={this.props.currentMainTab ==='Results' ? "col nav-link active link-button" :  "col nav-link link-button"} onClick={()=>this.activate('Results')} >Result answers</button>
                    </li>
                    </ul>
                </div>

                <FormInput style={this.props.currentMainTab ==='Query' ? {} : { display: 'none' }} /> 
                <TableQuery style={this.props.currentMainTab ==='Query' ? {} : { display: 'none' }} />
                <TableResult style={this.props.currentMainTab ==='Results' ? {} : { display: 'none' }} />
            </Fragment>
      )
    }
    
}


const mapStateToProps = ( state )=>{
    return {
        currentMainTab: state.Query.currentMainTab
    }
}

export default connect(mapStateToProps, actions)(Query)


