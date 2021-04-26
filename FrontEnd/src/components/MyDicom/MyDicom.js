import React, { Component } from 'react'
import apis from '../../services/apis'

class MyDicom extends Component{
  state = {
    user:-1,
    labels:-1,
  }

  constructor(props){
    super(props)
    this.initializeState()
    console.log(this.props)
  }

  getUser = async () => {
    let users = await apis.User.getUsers
    for(var i = 0;i<users.length;i++){
      if(users[i].username===this.props.username){
        this.setState({
          user:users[i]
        })
        break
      }
    }
    console.log(users)
  }

  getUserLabels = async () => {
    if(this.state.user!=null){
      let label_tab = await apis.userlabel.getUserLabels(this.state.user.id)
      this.setState({
        labels:label_tab
      })
      console.log(label_tab)
    }
  }

  initializeState = async () => {
    let user = await this.getUser()
    let userlabels = await this.getUserLabels()
    console.log('user :'+this.state.user)
    console.log('labels : '+this.state.labels)
  }

  getStudiesByLabel = async (name) => {
    return await apis.studylabel.getStudiesLabel(name)
  }

  componentDidMount = async () => {

  }

  render = () => {
    return (
      <div className='jumbotron'>
      </div>
    )
  }

}
export default MyDicom