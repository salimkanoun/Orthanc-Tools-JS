import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import AetButton from '../Components/AetButton'
import apis from '../../../services/apis'

import QueryForms from '../../CommonComponents/SearchForm/Form'
import { toast } from 'react-toastify'

export default ({onQuery}) => {

  const store = useSelector(state => {
    return {
      aets: state.OrthancTools.OrthancAets
    }
  })

  const dispatch = useDispatch()

  const componentDidMount = async () => {
    
    try {
      let aets = await apis.aets.getAets()
      dispatch.loadAvailableAETS(aets)
    } catch (error) {
      toast.error(error.statusText, {data:{type:'notification'}})
    }

  }

  const buildAetButtons = () => {
    return (store.aets.map((aet, key) =>
      <AetButton key={key} aetName={aet} />
    ))
  }

    return (
      <div>
        <QueryForms icon="fas fa-question" onFormValidate={(formData, event) => onQuery(formData, event.target.value)} title='Query'>
          <div>
            {store.aets !== undefined ? buildAetButtons() : null}
          </div>
        </QueryForms> 
      </div>
    )

}
