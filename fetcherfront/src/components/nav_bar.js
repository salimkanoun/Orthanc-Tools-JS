import React, { Component, Fragment } from 'react';
import FormInput from './form_input'
import CsvLoader from './csv_loader'
import TableQuery from './table_query'

import { connect } from 'react-redux'
import * as actions from '../actions'

class NavBar extends Component {

    activate(divName){
        this.props.setTab(divName)
    }

    render(){
        return(
            <Fragment>
                <div id="navBar" class="mb-5">
                    <ul class="nav nav-pills nav-fill">
                    <li class="nav-item">
                        <button className={this.props.currentMainTab ==='Query' ? "col nav-link active link-button" :  " col nav-link link-button"} onClick={()=>this.activate('Query')} >Add Query</button>
                    </li>
                    <li class="nav-item">
                        <button className={this.props.currentMainTab ==='Results' ? "col nav-link active link-button" :  "col nav-link link-button"} onClick={()=>this.activate('Results')} >Result answers</button>
                    </li>
                    </ul>
                </div>

                <FormInput style={this.props.currentMainTab ==='Query' ? {} : { display: 'none' }} /> 
                <CsvLoader style={this.props.currentMainTab ==='Query' ? {} : { display: 'none' }} />
                <TableQuery style={this.props.currentMainTab ==='Query' ? {} : { display: 'none' }} />
            </Fragment>
      )
    }
    
}


const mapStateToProps = ( state )=>{
    return {
        currentMainTab: state.NavBar.currentMainTab
    }
}

export default connect(mapStateToProps, actions)(NavBar)


