import React, {Component} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {TreeView, TreeItem} from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import apis from '../../services/apis'



class Metadata extends Component {

    useStyles = makeStyles({
        root: {
          height: 110,
          flexGrow: 1,
          maxWidth: 400,
        },
    });

    constructor(props){
        super(props)
        this.previewsInstance = this.previewsInstance.bind(this)
        this.nextInstances = this.nextInstances.bind(this)
    }

    state = {
        data: [], 
        InstancesArray: [],
        currentKey: 0, 
        InstancesTags: true
    }

    async componentDidMount() {
        let array = await apis.content.getSeriesInstances(this.props.serieID) 
        let id = []
        array.forEach(element => id.push(element.ID))
        this.setState({
            InstancesArray: id 
        })
        this.data()
    }

    async getInstancesArray(serieID){
        let array = await apis.content.getSeriesInstances(serieID)
        let id = []
        array.forEach(element => id.push(element.ID))
        this.setState({
            InstancesArray: id 
        })
    }
    

    async data(){
        let data = await apis.content.getInstances(this.state.InstancesArray[this.state.currentKey])
        let prepare = this.prepareData(data)
        this.setState({data: prepare, InstancesTags: true})
        return prepare
    }
 
    prepareData(data){
        let answer = []
        for (let id in data){
            answer.push(Array.isArray(data[id]) ? {name: id, value: data[id].map(node => this.prepareArray(node))} : {name: id, value: data[id]})
        }
        return answer
    }

    prepareArray(array){
        let answer = []
        for (let id in array){
            answer.push({
                name: id, value: array[id]
            })
        }
        return answer
            
    }

    renderTree(array){
        let rows = []
            if (Array.isArray(array)){
                array.forEach(nodes => {rows.push(
                        <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name}>
                            {Array.isArray(nodes.value) ? nodes.value.map((node) => this.renderTree(node)) : nodes.value}
                        </TreeItem>
                    )
                })
                    
            }
        return rows
    }

    async previewsInstance(){
        await this.setState({
            currentKey: this.state.currentKey - 1
        })
        this.data()
    }

    async nextInstances(){
        await this.setState({
            currentKey: this.state.currentKey + 1
        })
        this.data()
    }

    async setSharedTags(){
        this.setState({InstancesTags: false})
        let data = await apis.content.getSharedTags(this.props.serieID)
        this.setState({data: this.prepareData(data)})
    }


    render() {
        return (
            <div className='jumbotron'>
                <button type='button' className='btn btn-primary float-left mb-5' onClick={this.previewsInstance} disabled={this.state.currentKey === 0}>Previews Instances</button>
                <label htmlFor='compteur' className='bg-info text-center' >{(this.state.currentKey + 1) + '/' + this.state.InstancesArray.length}</label>
                <button type='button' className='btn btn-primary float-right mb-5' onClick={this.nextInstances} disabled={this.state.currentKey + 1 === this.state.InstancesArray.length}>Next Instances</button>
                <button type='button' className='btn btn-primary float-left' onClick={()=>this.setSharedTags()} disabled={!this.state.InstancesTags}>Shared Tags</button>
                <button type='button' className='btn btn-primary float-right' onClick={()=>this.data()} disabled={this.state.InstancesTags}>instances Tags</button>
                <TreeView 
                    className={this.useStyles.root}
                    defaultExpanded={['root']}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}>
                        {this.renderTree(this.state.data)}
                </TreeView>
            </div>
        );
    }
}

export default Metadata;