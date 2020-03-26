import { LOAD_AETS } from './actions-types'

export function loadAvailableAETS (aets) {
  return {
    type: LOAD_AETS,
    payload: aets
  }
}
