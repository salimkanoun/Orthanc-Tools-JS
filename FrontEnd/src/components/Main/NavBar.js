import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import ToolsPanel from './ToolsPanel'

import {
  Switch,
  Route,
  withRouter,
} from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

import { TransitionGroup, CSSTransition } from "react-transition-group";

import Footer from './Footer'
import Query from '../Query/Components/Query'
import AutoQueryRoot from '../AutoQuery/Connected_Component/AutoQueryRoot'
import RobotView from '../AutoQuery/Connected_Component/RobotView'
import AdminRootPanel from '../Admin/AdminRootPanel'
import Import from '../Import/Import'
import ContentRootPanel from '../OrthancContent/ContentRootPanel'
import ExportPanel from '../Export/ExportPanel'
import AnonRootPanel from '../Anonymize/AnonRootPanel'
import Delete from '../Delete/Delete'
import CDBurner from './../CDBurner/CDBurner'


export default class NavBar extends Component {

  state = {
    navBackground: null,
    currentTabSelect: null
  }


  componentDidMount = async () => {

    this.setState({
      navbar: document.documentElement.clientWidth < 992 ? 'responsive' : 'classique',
      currentTabSelect: 'content'
    })

    window.addEventListener('resize', () => {
      const size = document.documentElement.clientWidth
      size < 992 ? this.setState({ navbar: 'responsive' }) : this.setState({ navbar: 'classique' })
    });

    document.addEventListener("scroll", () => {
      const backgroundcolor = window.scrollY < 50 ? null : "primary";
      this.setState({ navBackground: backgroundcolor });
    });
  }

  AnimatedSwitch = withRouter(({ location }) => (
    <TransitionGroup>
      <CSSTransition key={location.key} classNames={'slide'} timeout={500} >
        <Switch location={location}>
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

  getLinkClass = (tabName) => {
    if (this.state.currentTabSelect === tabName) return 'nav-link active'
    else return 'nav-link'
  }

  selectTabHandler = (event) => {
    let target = event.target
    this.setState({
      currentTabSelect: target.name
    })
  }


  render = () => {
    return (
      <div className='app'>
        <Navbar fixed='top' collapseOnSelect expand='lg' bg={this.state.navbar === 'responsive' ? 'primary' : this.state.navBackground} variant='dark' >
          <Navbar.Toggle aria-controls='responsive_navbar' />
          <Navbar.Collapse id='responsive_navbvar'>
            {this.state.navbar === 'responsive' ? <div className='float-right'><ToolsPanel roles={this.props.token} apercu={false} /></div> : null}
            <Nav className='mr-auto'>
              <Link className={this.getLinkClass('content')} onClick={this.selectTabHandler} name='content' to='/orthanc-content' hidden={!this.props.token.content}>Orthanc Content</Link>
              <Link className={this.getLinkClass('import')} onClick={this.selectTabHandler} name='import' to='/import' hidden={!this.props.token.import}>Import</Link>
              <Link className={this.getLinkClass('query')} onClick={this.selectTabHandler} name='query' to='/query' hidden={!this.props.token.query}>Query</Link>
              <Link className={this.getLinkClass('auto-query')} onClick={this.selectTabHandler} name='auto-query' to='/auto-query' hidden={!this.props.token.auto_query}>Auto-Retrieve</Link>
              <Link className={this.getLinkClass('burner')} onClick={this.selectTabHandler} name='burner' to='/cd-burner' hidden={!this.props.token.cd_burner}>CD-burner</Link>
              <Link className={this.getLinkClass('administration')} onClick={this.selectTabHandler} name='administration' to='/administration' hidden={!this.props.token.admin}>Administration</Link>
              <Link className={this.getLinkClass('log-out')} name='log-out' onClick={this.props.onLogout} to='/'>Log out</Link>
            </Nav>
            {this.state.navbar === 'classique' ? <ToolsPanel roles={this.props.token} apercu={true} /> : null}
          </Navbar.Collapse>
        </Navbar>
        <div className='content-panel'>
          {this.state.currentTabSelect === null ? <Redirect to='/orthanc-content' /> : null}
          {<this.AnimatedSwitch />}
        </div>
        <Footer />
      </div>
    )
  }

}

