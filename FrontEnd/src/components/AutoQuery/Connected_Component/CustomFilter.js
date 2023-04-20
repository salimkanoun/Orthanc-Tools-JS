import React, { Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux'

export default ({ onFilter, ID, options, saveValues }) => {

    const [reverse, setReverse] = useState(false)
    const [lastValues, setLastValues] = useState([])

    const dispatch = useDispatch()
    const store = useSelector(state => {
        return {
            filters: state.AutoRetrieveResultList.filters
        }
    }
    )

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: reverse ? 'red' : 'blue'
        })
    }


    useEffect(() => {
        onFilter(store.filters[ID])
    }, [])



    const filter = (reverse, options) => {
        let values = []
        options ? options.forEach(element => values.push(element.value)) : values = lastValues
        setLastValues(values)
        if (reverse) {
            let answer = []
            options.forEach(element => {
                if (!values.includes(element.value)) answer.push(element.value)
            })
            if (answer.length === 0) answer = ['']
            values = answer
        }
        onFilter(values)
        dispatch.saveFilters(ID, values)
        saveValues() //save filtered values into the redux 
    }

    const handleClick = (e) => {
        e.stopPropagation()
        setReverse(!reverse)
        filter(!reverse)
    }

    const getDefaultValues = () => {
        let options = store.filters[ID]
        let defaultValue = []
        options ? options.forEach(element => defaultValue.push({ value: element, label: element })) : defaultValue = []
        return defaultValue
    }


    return (
        <Fragment>
            <Select isMulti options={options} defaultValue={getDefaultValues()}
                onChange={(values) => filter(reverse, values ? values : [])}
                styles={customStyles} menuPosition={'fixed'} />
            <input type="button" className="otjs-button otjs-button-blue w-10 m-2"
                value={reverse ? 'Normal Filter' : 'Reverse Filter'} onClick={handleClick} />
        </Fragment>

    );
}