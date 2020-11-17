import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import ToolsPanel from './ToolsPanel'
import apis from '../../services/apis'
import {
  Switch,
  Route,
  withRouter,
} from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

import { TransitionGroup, CSSTransition } from "react-transition-group";

import Query from '../Query/Components/Query'
import AutoQueryRoot from '../AutoQuery/Component/AutoQueryRoot'
import RobotView from '../AutoQuery/Connected_Component/RobotView'
import Authentication from '../Authentication'
import AdminRootPanel from '../Admin/AdminRootPanel'
import Import from '../Import/Import'
import ContentRootPanel from '../OrthancContent/ContentRootPanel'
import ExportPanel from '../Export/ExportPanel'
import AnonRootPanel from '../Anonymize/AnonRootPanel'
import Delete from '../Delete/Delete'
import CDBurner from './../CDBurner/CDBurner'

import { resetReducer } from '../../actions/LogOut'
import { saveUsername } from '../../actions/Username'
import { connect } from 'react-redux'


class NavBar extends Component {

  state = {
    navBackground: '#11ffee00',
    currentTabSelect : 'content',
    token: {}
  }

  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.selectTabHandler = this.selectTabHandler.bind(this)
  }


  async logout() {
    this.props.resetReducer() //empty all reducer
    document.cookie = 'tokenOrthancJs=undefined' //change value of the cookie to delete the token
    await apis.authentication.logOut() //do nothing (need to modify in back to increase security)

  }

  async componentDidMount() {

    this.setState({
      navbar: document.documentElement.clientWidth < 992 ? 'responsive' : 'classique'
    })

    window.addEventListener('resize', () => {
      const size = document.documentElement.clientWidth
      size < 992 ? this.setState({ navbar: 'responsive' }) : this.setState({ navbar: 'classique' })
    });

    document.addEventListener("scroll", () => {
      const backgroundcolor = window.scrollY < 50 ? "null" : "primary";

      this.setState({ navBackground: backgroundcolor });
    });

    let token = await apis.token.decodeCookie()
    this.props.saveUsername(token.username)
    this.setState({ token: token })
  }

  AnimatedSwitch = withRouter(({ location }) => (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames={location.pathname === '/' ? 'auth' : 'slide'} timeout={500} onEnter={() => this.props.setLocation(location.pathname)}>
        <Switch location={location}>
          <Route exact path='/' component={Authentication} />
          <Route exact path='/import' component={Import} />
          <Route exact path='/query' component={Query} />
          <Route exact path='/auto-query' component={AutoQueryRoot} />
          <Route exact path='/administration' component={AdminRootPanel} />
          <Route exact path='/orthanc-content' component={ContentRootPanel} />
          <Route exact path='/robot/:username' render={(props) => <RobotView username={props.match.params.username} />} />
          <Route exact path='/export' component={ExportPanel} />
          <Route exact path='/anonymize' component={AnonRootPanel} />
          <Route exact path='/cd-burner' component={CDBurner} />
          <Route exact path='/delete' component={Delete} />
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  ))

  getLinkClass(tabName){
    if(this.state.currentTabSelect ===tabName)  return 'nav-link active'
    else return 'nav-link'
  }

  selectTabHandler(event) {
    let target = event.target
    this.setState({
      currentTabSelect : target.name
    })
  }


  render() {
    return (
      <Fragment>
        <Navbar fixed='top' collapseOnSelect expand='lg' bg={this.state.navbar === 'responsive' ? 'primary' : this.state.navBackground} variant='dark' onRateChange={() => console.log('start')}>
          <Navbar.Toggle aria-controls='responsive_navbar' />
          <Navbar.Collapse id='responsive_navbvar'>
            {this.state.navbar === 'responsive' ? <div className='float-right'><ToolsPanel roles={this.state.token} apercu={false} /></div> : null}
            <Nav className='mr-auto'>
              <Link className={this.getLinkClass('content')} onClick = {this.selectTabHandler} name='content' to='/orthanc-content' hidden={!this.state.token.content}>Orthanc Content</Link>
              <Link className={this.getLinkClass('import')} onClick = {this.selectTabHandler} name = 'import' to='/import' hidden={!this.state.token.import}>Import</Link>
              <Link className={this.getLinkClass('query')} onClick = {this.selectTabHandler} name='query' to='/query' hidden={!this.state.token.query}>Query</Link>
              <Link className={this.getLinkClass('auto-query')} onClick = {this.selectTabHandler} name='auto-query' to='/auto-query' hidden={!this.state.token.auto_query}>Auto-Retrieve</Link>
              <Link className={this.getLinkClass('burner')} onClick = {this.selectTabHandler} name='burner' to='/cd-burner' hidden={!this.state.token.cd_burner}>CD-burner</Link>
              <Link className={this.getLinkClass('administration')} onClick = {this.selectTabHandler} name='administration' to='/administration' hidden={!this.state.token.admin}>Administration</Link>
              <Link className={this.getLinkClass('log-out')} name='log-out' onClick={this.logout} to='/'>Log out</Link>
            </Nav>
            {this.state.navbar === 'classique' ? <ToolsPanel roles={this.state.token} apercu={true} /> : null}
          </Navbar.Collapse>
        </Navbar>
        {<this.AnimatedSwitch />}
      </Fragment>
    )
  }

}

const mapsDispatchToProps = {
  resetReducer,
  saveUsername
}

export default connect(null, mapsDispatchToProps)(NavBar)

