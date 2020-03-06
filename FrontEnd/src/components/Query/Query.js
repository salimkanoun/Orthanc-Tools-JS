import React, { Component, Fragment } from 'react';
import FormInput from './FormInput';
import TableResult from './TableResult';

export default class Query extends Component {

    render(){
        return(
        <Fragment>
            <FormInput />
            <TableResult />
        </Fragment>
        )
    }
}