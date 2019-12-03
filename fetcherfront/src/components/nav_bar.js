import React, { Component, Fragment } from 'react';
import FormInput from './form_input'
import CsvLoader from './csv_loader'
import TableQuery from './table_query'

class NavBar extends Component {


    constructor(props){
        super(props)
        this.state={
            activeDiv : 'Query'
        }
    }


    activate(divName){
        this.setState(
            {
            activeDiv : divName
            }
        )

    }

    render(){
        return(
            <Fragment>
                <div id="navBar" class="mb-5">
                    <ul class="nav nav-pills nav-fill">
                    <li class="nav-item">
                        <button className={this.state.activeDiv ==='Query' ? "col nav-link active link-button" :  " col nav-link link-button"} onClick={()=>this.activate('Query')} >Add Query</button>
                    </li>
                    <li class="nav-item">
                        <button className={this.state.activeDiv ==='Results' ? "col nav-link active link-button" :  "col nav-link link-button"} onClick={()=>this.activate('Results')} >Result answers</button>
                    </li>
                    </ul>
                </div>

                <FormInput style={this.state.activeDiv ==='Query' ? {} : { display: 'none' }} /> 
                <CsvLoader style={this.state.activeDiv ==='Query' ? {} : { display: 'none' }} />
                <TableQuery style={this.state.activeDiv ==='Query' ? {} : { display: 'none' }} />
            </Fragment>
      )
    }

}

export default NavBar


