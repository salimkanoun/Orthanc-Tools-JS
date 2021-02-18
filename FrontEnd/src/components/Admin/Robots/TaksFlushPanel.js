import { Component, Fragment } from "react"
import apis from '../../../services/apis'

export default class RobotStatus extends Component {
    render = () => {
        return (
            <Fragment>
                <h2 className="card-title">Flush task</h2>
                <div className="grid-button-group">
                    <p>Flush anonymisation task : </p> 
                    <input type='button' className='row btn btn-danger' onClick={apis.anon.flush} value='flush' />
                    <p>Flush delete task : </p>
                    <input type='button' className='row btn btn-danger' onClick={apis.deleteRobot.flush} value='flush' />
                    <p>Flush export task : </p>
                    <input type='button' className='row btn btn-danger' onClick={apis.exportDicom.flushExternalExport} value='flush' />
                    <p>Flush retrieve task : </p>
                    <input type='button' className='row btn btn-danger' onClick={apis.retrieveRobot.flush} value='flush' />
                </div>
            </Fragment>
        )
    }
}