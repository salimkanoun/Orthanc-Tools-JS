import React, { useState, Fragment } from 'react';
import QueryForm from '../Connected_Components/QueryForm';
import TableResult from '../Connected_Components/TableResult';

export default function Query () {
    
    return(
        <Fragment>
            <QueryForm />
            <TableResult />
        </Fragment>
    )
    
}