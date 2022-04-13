import axios from "axios"

const autorouting = {
    /**
     * Get all the autorouters
     * @returns {Array.<JSON>} Autorouters
     */
  getAutorouters() {
      const getAutoroutersOptions = {
          method: 'GET',
      }
      return axios.get('/api/autorouting', getAutoroutersOptions).then((answer) => {
          if (!answer.ok) {
              throw answer
          }
          return answer.json()
      }).catch(error => {
          throw error
      })
  },
  /**
   * Get an autorouter by id
   * @param {number} id id of the autorouter
   * @returns {JSON} Autorouter
   */
  getAutorouterByID(id) {
    const getAutorouterByIDOptions = {
        method: 'GET',
    }
    return axios.get('/api/autorouting/'+id, getAutorouterByIDOptions).then((answer) => {
        if (!answer.ok) {
            throw answer
        }
        return answer.json()
    }).catch(error => {
        throw error
    })
  },

  /**
   * Create an autorouter
   * @param {String} name name of the autorouter
   * @param {String} condition "OR" / "AND"
   * @param {Array.<JSON>} rules rules to check
   * @param {Array.<String>} destination Aets name
   * @returns 
   */
  createAutorouter(name,condition,rules,destination) {
    const autorouter = {
        condition:condition,
        rules:rules,
        destination:destination
    }
    const createAutorouterOptions = {
        method: 'POST',
        body: JSON.stringify(autorouter)
    }

    return axios.post('/api/autorouting/' + name, createAutorouterOptions).then((answer) => {
        if (!answer.ok) {
            throw answer
        }
        return true
    })

  },

    /**
   * Modify an autorouter
   * @param {number} id autorouter's id to modify
   * @param {String} name name of the autorouter
   * @param {String} condition "OR" / "AND"
   * @param {Array.<JSON>} rules rules to check
   * @param {Array.<String>} destination Aets name
   * @returns 
   */
  modifyAutorouter(id,name,condition,rules,destination) {
    const autorouter = {
      name:name,
      condition:condition,
      rules:rules,
      destination:destination
    }
    const modifyAutorouterOptions = {
        method: 'PUT',
        body: JSON.stringify(autorouter)
    }

    return axios.put('/api/autorouting/'+id, modifyAutorouterOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  },

  /**
   * Turn on/off an Autorouter
   * @param {number} id autourouter's id to switch
   * @param {boolean} running boolean of running process
   * @returns 
   */
  switchOnOff(id,running) {
    const autorouter = {
      running:running
    }
    const switchOnOffOptions = {
        method: 'PUT',
        body: JSON.stringify(autorouter)
    }

    return axios.put('/api/autorouting/'+id+'/running', switchOnOffOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  },

  /**
   * Delete an autorouter
   * @param {number} id autorouter's id
   * @returns 
   */
  deleteAutorouter(id) {
      const deleteAutorouterOptions = {
          method: 'DELETE',
      }

      return axios.delete('/api/autorouting/' + id, deleteAutorouterOptions).then((answer) => {
          if (!answer.ok) {
              throw answer
          }
          return true
      })
  }
}
export default autorouting