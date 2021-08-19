import React, { Component } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { TreeView, TreeItem } from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NumericInput from 'react-numeric-input';

import apis from '../../services/apis'
import { toast } from 'react-toastify';

export default class Metadata extends Component {

    useStyles = makeStyles({
        root: {
            height: 110,
            flexGrow: 1,
            maxWidth: 400,
        },
    });


    state = {
        data: [],
        InstancesArray: [],
        currentKey: 0,
        InstancesTags: true,
        text: 'disabled'
    }

    componentDidMount = async () => {
        let instanceArray  = await this.getInstancesArray(this.props.serieID)
        this.setState({
            InstancesArray: instanceArray
        })
        this.updateData()
    }

    getInstancesArray = async (serieID) => {
        try{
            let array = await apis.content.getSeriesInstances(serieID)
            let idArray = array.map(element => (element.ID))
            return idArray
        } catch(error){
            toast.error(error.statusText)
            return []
        }

    }


    updateData = async () => {
        let data
        try{
            let instances = await apis.content.getInstances(this.state.InstancesArray[this.state.currentKey])
            let header = await apis.content.getHeader(this.state.InstancesArray[this.state.currentKey])
            data = { ...instances, ...header }

        }catch(error){
            toast.error(error.statusText)
            return
        }
        let prepare = this.prepareData(data)
        this.setState({ data: prepare, InstancesTags: true })
    }

    prepareData = (data) => {
        let answer = []
        for (let dicomTag of Object.keys(data).sort()) {
            let tagName = data[dicomTag]['Name']
            let value = data[dicomTag]['Value']

            let answerData = { name: (dicomTag + ' - ' + tagName) }
            if (Array.isArray(value)) {
                answerData['value'] = value.map(node => this.prepareData(node))
            } else {
                answerData['value'] = value
            }

            answer.push(answerData)
        }

        return answer
    }

    renderTree = (array) => {
        let rows = []
        if (Array.isArray(array)) {
            array.forEach(nodes => {
                rows.push(
                    <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name}>
                        {Array.isArray(nodes.value) ? nodes.value.map((node) => this.renderTree(node)) : nodes.value}
                    </TreeItem>
                )
            })

        }
        return rows
    }

    setSharedTags = async () => {
        if (this.state.text === 'disabled') {
            try{
                this.setState({ data: [], text: 'Fetching...' })
                let data = await apis.content.getSharedTags(this.props.serieID)
                this.setState({ data: this.prepareData(data), text: 'enabled' })
            }catch (error) {
                toast.error(error.statusText)
            }
        } else {
            this.updateData()
            this.setState({ text: 'disabled' })
        }
    }

    handleChange = (num) => {
        this.setState(prevState => ({
            currentKey: num >= prevState.InstancesArray.length ? prevState.InstancesArray.length - 1 : num < 0 ? 0 : num
        }), () => this.updateData())
    }

    render = () => {
        return (
            <div>
                <div className='row mb-4'>
                    <div className='col'>
                        <button type='button' className='otjs-button otjs-button-blue w-12' onClick={() => this.setSharedTags()} disabled={!this.state.InstancesTags}>Shared Tags: {this.state.text}</button>
                    </div>
                    <div className='col ml-3'>
                        <div className='row'>
                            <label htmlFor='numberInstances' className='text-center'>Number of instances : {this.state.InstancesArray.length}</label>
                        </div>
                        <div className='row' hidden={this.state.text === 'enabled' || this.state.InstancesArray.length === 1}>
                            <NumericInput min={1} max={this.state.InstancesArray.length} value={this.state.currentKey + 1} onChange={(num => this.handleChange(num - 1))} />
                        </div>
                    </div>
                </div>
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