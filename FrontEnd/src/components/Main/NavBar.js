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
import ImportRootPanel from '../Import/ImportRootPanel'
import ContentRootPanel from '../OrthancContent/ContentRootPanel'
import ExportPanel from '../Export/ExportPanel'
import AnonRootPanel from '../Anonymize/AnonRootPanel'
import Delete from '../Delete/Delete'
import CDBurner from './../CDBurner/CDBurner'
import MyDicom from '../MyDicom/MyDicom'
import DicomRouterPanel from '../Dicom Router/DicomRouterPanel'


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
            {this.state.navbar === 'responsive' ? <div className='float-right'><ToolsPanel roles={this.props.roles} apercu={false} /></div> : null}
            <Nav className='mr-auto'>
              <Link className={this.getLinkClass('content')} onClick={this.selectTabHandler} name='content' to='/orthanc-content' hidden={!this.props.roles.content}>Orthanc Content</Link>
              <Link className={this.getLinkClass('import')} onClick={this.selectTabHandler} name='import' to='/import' hidden={!this.props.roles.import}>Import</Link>
              <Link className={this.getLinkClass('query')} onClick={this.selectTabHandler} name='query' to='/query' hidden={!this.props.roles.query}>Query</Link>
              <Link className={this.getLinkClass('auto-query')} onClick={this.selectTabHandler} name='auto-query' to='/auto-query' hidden={!this.props.roles.auto_query}>Auto-Retrieve</Link>
              <Link className={this.getLinkClass('burner')} onClick={this.selectTabHandler} name='burner' to='/cd-burner' hidden={!this.props.roles.cd_burner}>CD-burner</Link>
              <Link className={this.getLinkClass('mydicom')} onClick={this.selectTabHandler} name='mydicom' to='/mydicom'>MyDicom</Link>
              <Link className={this.getLinkClass('dicom-router')} onClick={this.selectTabHandler} name='dicom-router' to='/dicom-router' hidden={!this.props.roles.autorouting}>Dicom-Router </Link>
              <Link className={this.getLinkClass('administration')} onClick={this.selectTabHandler} name='administration' to='/administration' hidden={!this.props.roles.admin}>Administration</Link>
              <Link className={this.getLinkClass('log-out')} name='log-out' onClick={this.props.onLogout} to='/'>Log out</Link>
            </Nav>
            {this.state.navbar === 'classique' ? <ToolsPanel roles={this.props.roles} apercu={true} /> : null}
          </Navbar.Collapse>
        </Navbar>
        <div className='content-panel'>
          {this.state.currentTabSelect === null ? <Redirect to='/orthanc-content' /> : null}
          <AnimatedSwitch />
        </div>
        <Footer />
      </div>
    )
  }

}


const AnimatedSwitch = withRouter(({ location }) => (
  <TransitionGroup>
    <CSSTransition key={location.key} classNames={'slide'} timeout={500} >
      <Switch location={location}>
        <Route exact path='/import' component={ImportRootPanel} />
        <Route exact path='/query' component={Query} />
        <Route exact path='/auto-query' component={AutoQueryRoot} />
        <Route exact path='/administration' component={AdminRootPanel} />
        <Route exact path='/orthanc-content' component={ContentRootPanel} />
        <Route exact path='/robot/:id' render={(props) => <RobotView id={props.match.params.id} />} />
        <Route exact path='/export' component={ExportPanel}  />
        <Route exact path='/anonymize' component={AnonRootPanel} />
        <Route exact path='/cd-burner' component={CDBurner} />
        <Route exact path='/mydicom' component={MyDicom}/>
        <Route exact path='/delete' component={Delete} />
        <Route exact path='/dicom-router' component={DicomRouterPanel}/>
      </Switch>
    </CSSTransition>
  </TransitionGroup>
))

