const autorouter = {
  getAutorouters() {
      const getAutoroutersOptions = {
          method: 'GET',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
          }
      }
      return fetch('/api/autorouting', getAutoroutersOptions).then((answer) => {
          if (!answer.ok) {
              throw answer
          }
          return answer.json()
      }).catch(error => {
          throw error
      })
  },
  getAutorouterByID(id) {
    const getAutorouterByIDOptions = {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
    return fetch('/api/autorouting/'+id, getAutorouterByIDOptions).then((answer) => {
        if (!answer.ok) {
            throw answer
        }
        return answer.json()
    }).catch(error => {
        throw error
    })
  },

  createAutorouter(name,rules,destination) {
    const autorouter = {
        rules:rules,
        destination:destination
    }
    const createAutorouterOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(autorouter)
    }

    return fetch('/api/autorouting/' + name, createAutorouterOptions).then((answer) => {
        if (!answer.ok) {
            throw answer
        }
        return true
    })

  },

  modifyAutorouter(id,name,rules,destination) {
    const autorouter = {
      name:name,
      rules:rules,
      destination:destination
    }
    const modifyAutorouterOptions = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(autorouter)
    }

    return fetch('/api/autorouting/'+id, modifyAutorouterOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  },

  switchOnOff(id,running) {
    const autorouter = {
      running:running
    }
    const switchOnOffOptions = {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(autorouter)
    }

    return fetch('/api/autorouting/'+id+'/running', switchOnOffOptions).then((answer) => {
        if (!answer.ok) { throw answer }
        return true
    })
  },

  deleteAutorouter(id) {
      const deleteAutorouterOptions = {
          method: 'DELETE',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
          },
      }

      return fetch('/api/autorouting/' + id, deleteAutorouterOptions).then((answer) => {
          if (!answer.ok) {
              throw answer
          }
          return true
      })
  }
}
export default autorouter