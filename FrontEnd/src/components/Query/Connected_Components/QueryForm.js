import React from 'react'

import AetButton from '../Components/AetButton'
import apis from '../../../services/apis'

import QueryForms from '../../CommonComponents/SearchForm/Form'
import { toast } from 'react-toastify'
import { useCustomQuery } from '../../CommonComponents/ReactQuery/hooks'
import Spinner from '../../CommonComponents/Spinner'
import { keys } from '../../../model/Constant'

export default ({ onQuery }) => {

  const { data: aets, isLoading } = useCustomQuery(
    [keys.AETS_KEY],
    () => apis.aets.getAets(),
    undefined
    
  )

  const buildAetButtons = () => {
    return (aets.map((aet, key) =>
      <AetButton key={key} aetName={aet} />
    ))
  }

  if (isLoading) return <Spinner />

  return (
    <div>
      <QueryForms icon="fas fa-question" onFormValidate={(formData, event) => onQuery(formData, event.target.value)} title='Query'>
        <div>
          {buildAetButtons()}
        </div>
      </QueryForms>
    </div>
  )

}
