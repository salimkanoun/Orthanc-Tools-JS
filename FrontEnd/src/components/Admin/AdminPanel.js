import React, { Component } from 'react'
import Options from './Options'
import RobotStatus from './RobotStatus'
import AetPanel from './AetPanel'

export default class AdminPanel extends Component {

  constructor(props){
    super(props)
    this.clickHandler=this.clickHandler.bind(this)
    this.state ={
      selectedOptionMenu : 'General'
    }
  }


  clickHandler(event){
    console.log(event)
    console.log(event.target.value)
    this.setState({
      selectedOptionMenu : event.target.value
    })
  }

  getComponentToDisplay(){
    switch (this.state.selectedOptionMenu){
      case 'General' : 
        return ([<Options />])
      case 'Aets' : 
        return ([ <AetPanel />])
      case 'Robots' : 
        return ([<RobotStatus />])
      default : 
        return ([])
    }
  }

  render () {
    let components = this.getComponentToDisplay()
    return (
      <div className='jumbotron row'>
        <div className="col-3">
            <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
              <input className="btn btn-link text-left" type="button" onClick={this.clickHandler} value="General" />
              <input className="btn btn-link text-left" type="button" onClick={this.clickHandler} value="Aets" />
              <input className="btn btn-link text-left" type="button" onClick={this.clickHandler} value="Robots" />
            </div>
        </div>
        <div className="col-sm">
            {components}
        </div>
      </div>
    )
  }
}
