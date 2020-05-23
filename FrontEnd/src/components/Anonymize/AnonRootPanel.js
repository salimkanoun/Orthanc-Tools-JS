import React, { Component, Fragment } from 'react'

import AnonymizedResults from "./AnonymizedResults";
import AnonymizePanel from './AnonymizePanel';
import { connect } from 'react-redux';


class AnonRootPanel extends Component {

    render() {
        return (
            <Fragment>
                <div className='jumbotron' hidden={this.props.anonList && this.props.anonList.length === 0}>
                    <h2 className='card-title mb-3'>Anonymize</h2>
                    <AnonymizePanel />
                </div>
                <div className='jumbotron'  hidden={this.props.anonymizedList && this.props.anonymizedList.length === 0}>
                    <AnonymizedResults />
                </div>
            </Fragment>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        anonList: state.AnonList.anonList, 
        anonymizedList: state.AnonList.anonymizedList
    }
}

export default connect(mapStateToProps)(AnonRootPanel)