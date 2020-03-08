import React, { Component, Fragment } from 'react';
import QueryForm from './Connected_Components/QueryForm';
import TableResult from './TableResult';

export default class Query extends Component {

    render(){
        return(
        <Fragment>
            <QueryForm />
            <TableResult />
        </Fragment>
        )
    }
}