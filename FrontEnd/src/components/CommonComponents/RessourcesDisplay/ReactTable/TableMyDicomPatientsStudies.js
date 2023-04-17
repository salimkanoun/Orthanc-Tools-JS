import React,{Component} from 'react'
import ConstantLevel from '../../../Modify/ConstantLevel'
import ActionBouton from '../ActionBouton'
import Table from './CommonSelectingAndFilteringTable'

export default ({data, onRowClick, onSelect, rowStyle}) => {

  const columns = [
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
        Header: 'Patient ID',
        accessor: 'PatientID',
      },
      {
        Header :'Patient Name',
        accessor:'PatientName',
      },
      {
        Header: 'Study Date',
        accessor:'StudyDate',
        disableFilters:true
      },
      {
        Header: 'Description',
        accessor: 'StudyDescription',
      },
      {
        Header: 'Accession number',
        accessor: 'AccessionNumber',
      },
      {
        Header: 'Action',
        Cell:(row)=>{
          return(
          <span>
            <ActionBouton level={ConstantLevel.STUDIES}   
              orthancID={row.cell.row.values.StudyOrthancID} 
              StudyInstanceUID={row.cell.row.values.StudyInstanceUID} 
              dataDetails={row.cell.row} 
              hiddenModify={true} 
              hiddenDelete={true} 
              hiddenCreateDicom={true} 
            />
          </span>
          )
        }
      },
    ]

      return (
          <Table 
            tableData={data}
            columns={columns}
            onRowClick={onRowClick}
            onSelect={onSelect}
            rowStyle={rowStyle}
          />
      )
}