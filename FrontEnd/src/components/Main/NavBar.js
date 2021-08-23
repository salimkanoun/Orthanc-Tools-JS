import React, {Component} from 'react'
import {Link, Redirect, Route, Switch, withRouter} from 'react-router-dom'
import ToolsPanel from './ToolsPanel'
import {Nav, Navbar, Image} from 'react-bootstrap'
   
import {CSSTransition, TransitionGroup} from "react-transition-group";

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

import image from '../../assets/images/logo.png';


export default class NavBar extends Component {

    state = {
        currentTabSelect: null
    }

    
    componentDidMount = async () => {
        this.setState({
            navbar: document.documentElement.clientWidth < 992 ? 'responsive' : 'classique',
            currentTabSelect: 'content'
        })

        window.addEventListener('resize', () => {
            const size = document.documentElement.clientWidth
            size < 992 ? this.setState({navbar: 'responsive'}) : this.setState({navbar: 'classique'})
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

    closeNavbar = (event) => {

        var elementBgNavbar = document.getElementById('bg-navbar');
        var elementNavbar = document.getElementById('navbar');
        var elementMain = document.getElementById('main');
        var elementIcone = document.getElementsByClassName('icone');
        var elementLogo = document.getElementById('logo');
        var elementBorderNavbar = document.getElementsByClassName('otjs-navbar-border');

        if (event.type !== "mouseenter"){
            elementBgNavbar.classList.add("bg-navbar-close");
            elementNavbar.classList.add("otjs-navbar-close");
            elementMain.classList.add('main-nav-close');
            elementLogo.classList.add("navbar-image-close");
            for(var i = 0; i < elementIcone.length; i++){
                elementIcone[i].style.visibility = "visible";
                elementIcone[i].style.fontSize = "14px";
            }
            for(var j = 0; j < elementBorderNavbar.length; j++){
                elementBorderNavbar[j].style.visibility = "hidden";
            }
           
        }else{
            elementBgNavbar.classList.remove("bg-navbar-close");
            elementNavbar.classList.remove("otjs-navbar-close");
            elementMain.classList.remove('main-nav-close');
            elementLogo.classList.remove("navbar-image-close");
            for(var k = 0; k < elementBorderNavbar.length; k++){
                elementBorderNavbar[k].style.visibility = "visible";
            }
            
        }
    }

    render = () => {
        return (
            <div className='app'>
                
                
                {this.state.navbar === 'classique' ? <Image id="logo" className="navbar-image" src={image} /> : null}

                <div id="bg-navbar" className="bg-navbar"> </div>
                <Navbar id="navbar" onMouseEnter={this.closeNavbar} onMouseLeave={this.closeNavbar} className="otjs-navbar d-flex flex-row" fixed='top' collapseOnSelect expand='lg' variant='dark'>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <Nav className="me-auto">
                            
                            <div className="otjs-navbar-border"> </div>
                            <Link className={this.getLinkClass('content')} onClick={this.selectTabHandler}
                                  name='content' to='/orthanc-content' hidden={!this.props.roles.content}>
                                <i className="fas fa-search icone"></i> Orthanc Content
                            </Link>
                            <Link className={this.getLinkClass('import')} onClick={this.selectTabHandler} name='import'
                                  to='/import' hidden={!this.props.roles.import}>
                                <i className="fas fa-file-import icone"></i> Import
                            </Link>
                            <Link className={this.getLinkClass('query')} onClick={this.selectTabHandler} name='query'
                                  to='/query' hidden={!this.props.roles.query}>
                                <i className="fas fa-question icone"></i> Query
                            </Link>
                            <Link className={this.getLinkClass('auto-query')} onClick={this.selectTabHandler}
                                  name='auto-query' to='/auto-query'
                                  hidden={!this.props.roles.auto_query}>
                                <i className="fas fa-recycle icone"></i> Auto-Retrieve
                            </Link>
                            <Link className={this.getLinkClass('burner')} onClick={this.selectTabHandler} name='burner'
                                  to='/cd-burner' hidden={!this.props.roles.cd_burner}>
                                <i className="fas fa-compact-disc icone"></i> CD-burner
                            </Link>
                            <Link className={this.getLinkClass('mydicom')} onClick={this.selectTabHandler}
                                  name='mydicom' to='/mydicom'>
                                <i className="far fa-images icone"></i> MyDicom
                            </Link>
                            <Link className={this.getLinkClass('dicom-router')} onClick={this.selectTabHandler}
                                  name='dicom-router' to='/dicom-router'
                                  hidden={!this.props.roles.autorouting}>
                                <i className="fas fa-broadcast-tower icone"></i> Dicom-Router
                            </Link>
                            <Link className={this.getLinkClass('administration')} onClick={this.selectTabHandler}
                                  name='administration' to='/administration'
                                  hidden={!this.props.roles.admin}>
                                <i className="fas fa-cogs icone"></i> Administration
                            </Link>

                            <div className="otjs-navbar-border"> </div>

                            <Link className={this.getLinkClass('log-out')} name='log-out' onClick={this.props.onLogout} to='/'>
                                <i className="fas fa-power-off icone"></i> Log out
                            </Link>
                                            

                        </Nav>
                      
                    </Navbar.Collapse>
                </Navbar>

                {this.state.navbar === 'responsive' ? <div className="toolsPanel"> <ToolsPanel roles={this.props.roles} apercu={true} /> </div> : null}
                {this.state.navbar === 'classique' ? <div className="toolsPanel"> <ToolsPanel roles={this.props.roles} apercu={true} /> </div> : null}
                
                
                {this.state.currentTabSelect === null ? <Redirect to='/orthanc-content'/> : null}
                <AnimatedSwitch/>
                    
                
                <Footer/>
                
            </div>
        )
    }

}


const AnimatedSwitch = withRouter(({location}) => (
    <TransitionGroup>
        <CSSTransition key={location.key} timeout={500} unmountOnExit classNames={"alert"}>
            <div id={"main"} className="main">
                <Switch location={location}>
                    <Route exact path='/import' component={ImportRootPanel}/>
                    <Route exact path='/query' component={Query}/>
                    <Route exact path='/auto-query' component={AutoQueryRoot}/>
                    <Route exact path='/administration' component={AdminRootPanel}/>
                    <Route exact path='/orthanc-content' component={ContentRootPanel}/>
                    <Route exact path='/robot/:id' render={(props) => <RobotView id={props.match.params.id}/>}/>
                    <Route exact path='/export' component={ExportPanel}/>
                    <Route exact path='/anonymize' component={AnonRootPanel}/>
                    <Route exact path='/cd-burner' component={CDBurner}/>
                    <Route exact path='/mydicom' component={MyDicom}/>
                    <Route exact path='/delete' component={Delete}/>
                    <Route exact path='/dicom-router' component={DicomRouterPanel}/>
                </Switch>
            </div>
        </CSSTransition>
    </TransitionGroup>
))

