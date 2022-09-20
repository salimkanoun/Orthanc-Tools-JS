import React, {Component} from 'react'
import {Link, Redirect, Route, Switch, withRouter} from 'react-router-dom'
import ToolsPanel from './ToolsPanel'
import {Image, Nav, Navbar} from 'react-bootstrap'

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


const RESPONSIVE_LIMIT = 992;
export default class NavBar extends Component {

    state = {
        currentTabSelect: null,
        opened: false
    }


    componentDidMount = async () => {
        this.setState({
            navbar: document.documentElement.clientWidth < RESPONSIVE_LIMIT ? 'responsive' : 'classique',
            currentTabSelect: 'content'
        })

        window.addEventListener('resize', () => {
            const size = document.documentElement.clientWidth
            this.setState({navbar: size < RESPONSIVE_LIMIT ? 'responsive' : 'classique'})
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


                {this.state.navbar === 'classique' ?
                    <Image id="logo" className={"navbar-image" + (this.state.opened ? "" : " navbar-image-close")}
                           src={image}/> : null}

                <div id="bg-navbar" className={this.state.opened ? "bg-navbar" : "bg-navbar bg-navbar-close"}></div>
                <Navbar id="navbar" onMouseEnter={() => this.setState({opened: true})}
                        onMouseLeave={() => this.setState({opened: false})}
                        className={"otjs-navbar d-flex flex-row" + (this.state.opened ? '' : ' otjs-navbar-closed')}
                        fixed='top'
                        collapseOnSelect expand='lg'
                        variant='dark'>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <Nav className="me-auto">

                            <div className="otjs-navbar-border" hidden={!this.state.opened}></div>
                            <Link className={this.getLinkClass('content')} onClick={this.selectTabHandler}
                                  name='content' to='/orthanc-content' hidden={!this.props.roles.content}>
                                <i className="fas fa-search icone"></i> {this.state.opened ? 'Danh sách DICOM' : ''}
                            </Link>
                            <Link className={this.getLinkClass('import')} onClick={this.selectTabHandler} name='import'
                                  to='/import' hidden={!this.props.roles.import}>
                                <i className="fas fa-file-import icone"></i> {this.state.opened ? 'Thêm ảnh' : ''}
                            </Link>
                            <Link className={this.getLinkClass('query')} onClick={this.selectTabHandler} name='query'
                                  to='/query' hidden={!this.props.roles.query}>
                                <i className="fas fa-question icone"></i> {this.state.opened ? 'Truy vấn' : ''}
                            </Link>
                            <Link className={this.getLinkClass('auto-query')} onClick={this.selectTabHandler}
                                  name='auto-query' to='/auto-query'
                                  hidden={!this.props.roles.auto_query}>
                                <i className="fas fa-recycle icone"></i> {this.state.opened ? 'Truy xuất-Tự động' : ''}
                            </Link>
                            <Link className={this.getLinkClass('burner')} onClick={this.selectTabHandler} name='burner'
                                  to='/cd-burner' hidden={!this.props.roles.cd_burner}>
                                <i className="fas fa-compact-disc icone"></i> {this.state.opened ? 'Ghi CD' : ''}
                            </Link>
                            <Link className={this.getLinkClass('mydicom')} onClick={this.selectTabHandler}
                                  name='mydicom' to='/mydicom'>
                                <i className="far fa-images icone"></i> {this.state.opened ? 'Dicom' : ''}
                            </Link>
                            <Link className={this.getLinkClass('dicom-router')} onClick={this.selectTabHandler}
                                  name='dicom-router' to='/dicom-router'
                                  hidden={!this.props.roles.autorouting}>
                                <i className="fas fa-broadcast-tower icone"></i> {this.state.opened ? 'Bộ định tuyến Dicom' : ''}
                            </Link>
                            <Link className={this.getLinkClass('administration')} onClick={this.selectTabHandler}
                                  name='administration' to='/administration'
                                  hidden={!this.props.roles.admin}>
                                <i className="fas fa-cogs icone"></i> {this.state.opened ? 'Quản trị' : ''}
                            </Link>

                            <div className="otjs-navbar-border" hidden={!this.state.opened}></div>

                            <Link className={this.getLinkClass('log-out')} name='log-out' onClick={this.props.onLogout}
                                  to='/'>
                                <i className="fas fa-power-off icone"></i>{this.state.opened ? 'Đăng xuất' : ''}
                            </Link>


                        </Nav>

                    </Navbar.Collapse>
                </Navbar>

                {this.state.navbar === 'responsive' ?
                    <div className="toolsPanel"><ToolsPanel roles={this.props.roles} apercu={true}/></div> : null}
                {this.state.navbar === 'classique' ?
                    <div className="toolsPanel"><ToolsPanel roles={this.props.roles} apercu={true}/></div> : null}


                {this.state.currentTabSelect === null ? <Redirect to='/orthanc-content'/> : null}
                <AnimatedSwitch opened={this.state.opened}/>


                <Footer/>

            </div>
        )
    }

}


const AnimatedSwitch = withRouter(({location, ...props}) => (
    <TransitionGroup>
        <CSSTransition key={location.key} timeout={500} unmountOnExit classNames={"alert"}>
            <div id={"main"} className={"main" + (props.opened ? '' : ' main-nav-close')}>
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

