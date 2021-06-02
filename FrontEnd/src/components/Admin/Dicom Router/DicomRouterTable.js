import React, {Component} from "react";
import apis from "../../../services/apis";
import Table from '../../CommonComponents/RessourcesDisplay/ReactTable/CommonTable'
import Toggle from 'react-toggle'

class DicomRouterTable extends Component {
    state={
      data:this.props.data || []
    }

    columns = [
      {
        Header: 'ID',
        accessor : 'id',
        hidden:true
      },
      {
        Header: 'Router\'s Name',
        accessor : 'name',
      },
      {
        Header: 'Rules',
        accessor:'rules',
      },
      {
        Header: 'Target',
        accessor: 'target',
        hidden:true
      },
      {
        Header :'AET Destination',
        accessor:'destination',
      },
      {
        Header: 'Running ?',
        accessor:'running',
        Cell:(row)=>{
          return(
          <span>
            <Toggle checked={row.row.values.running} onChange={()=>{this.handleSwitch(row)}}/>
          </span>
          )
        }
      },
    ]

    handleSwitch= async (row) => {
      let data = this.state.data
      for(let i = 0;i<data.length;i++){
        if(data[i].id===row.row.values.id){
          await apis.autorouter.switchOnOff(row.row.values.id,!(data[i].running))
          row.row.values.running=!(data[i].running)
          data[i].running=!(data[i].running)
          this.props.refresh()
          break
        }
      }
      this.setState({data:data})
    }

    render = () => {
      return(
        <Table columns={this.columns} tableData={this.state.data}/>
      )
    }
}

export default DicomRouterTable