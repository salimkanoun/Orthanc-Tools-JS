import { createContext } from 'react'

const GaelOContext = createContext({
    userId: null,
    token: null,
    studyName: null
})

export default GaelOContext