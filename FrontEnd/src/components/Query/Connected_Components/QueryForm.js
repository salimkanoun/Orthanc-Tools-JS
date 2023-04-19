import React from 'react'

import apis from '../../../services/apis'

import SearchForm from '../../CommonComponents/SearchForm/SearchForm'
import Spinner from '../../CommonComponents/Spinner'
import { keys } from '../../../model/Constant'
import { useCustomQuery } from '../../../services/ReactQuery/hooks'

export default ({ onQuery }) => {

  const { data: aets, isLoading } = useCustomQuery(
    [keys.AETS_KEY],
    () => apis.aets.getAets(),
    undefined
  )

  if (isLoading) return <Spinner />

  return (
    <div>
      <SearchForm buttonsName={aets} icon="fas fa-question" onFormValidate={(formData, aet) => onQuery(formData, aet)} title='Query' />
    </div>
  )

}
