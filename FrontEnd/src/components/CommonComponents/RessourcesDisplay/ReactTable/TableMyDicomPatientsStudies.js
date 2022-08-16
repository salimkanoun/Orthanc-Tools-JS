import React,{Component} from 'react'
import ActionBouton from '../ActionBouton'
import Table from './CommonSelectingAndFilteringTable'

export default class TableMyDicomPatientsStudies extends Component{

  columns = [
      {
        Header: 'Study Orthanc ID',
        accessor : 'StudyOrthancID',
        hidden:true
      },
      {
        Header: 'Study Instance UID',
        accessor:'StudyInstanceUID',
        hidden:true
      },
      {
        Header: 'Mã bệnh nhân',
        accessor: 'PatientID',
      },
      {
        Header :'Tên bệnh nhân',
        accessor:'PatientName',
      },
      {
        Header: 'Ngày nghiên cứu',
        accessor:'StudyDate',
        disableFilters:true
      },
      {
        Header: 'Mô tả nghiên cứu',
        accessor: 'StudyDescription',
      },
      {
        Header: 'Mã số',
        accessor: 'AccessionNumber',
      },
      {
        Header: 'Hành động',
        Cell:(row)=>{
          return(
          <span>
            <ActionBouton level='studies'   
              orthancID={row.cell.row.values.StudyOrthancID} 
              StudyInstanceUID={row.cell.row.values.StudyInstanceUID} 
              row={row.cell.row} 
              hiddenModify={true} 
              hiddenDelete={true} 
              hiddenCreateDicom={true} 
            />
          </span>
          )
        }
      },
    ]

    render = () => {
      return (
          <Table 
            tableData={this.props.data}
            columns={this.columns}
            onRowClick={this.props.onRowClick}
            onSelect={this.props.onSelect}
            rowStyle={this.props.rowStyle}
          />
      )
  }
}