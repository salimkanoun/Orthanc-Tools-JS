import React, { Component, Fragment } from 'react';
import FormInput from './form_input'
import CsvLoader from './csv_loader'

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

        let selectedDiv=null;
        if(this.state.activeDiv ==='Query'){
            selectedDiv=<Fragment><FormInput /> <CsvLoader /></Fragment>
        }else {

        }
        return(
            <Fragment>
            <div id="navBar" class="mb-5">
                <ul class="nav nav-pills nav-fill">
                <li class="nav-item">
                    <button className={this.state.activeDiv ==='Query' ? "nav-link active" :  "nav-link"} onClick={()=>this.activate('Query')} >Add Query</button>
                </li>
                <li class="nav-item">
                    <button className={this.state.activeDiv ==='Results' ? "nav-link active" :  "nav-link"} onClick={()=>this.activate('Results')} >Result answers</button>
                </li>
                </ul>
            </div>
            {selectedDiv}
            </Fragment>
      )
    }

}

export default NavBar


