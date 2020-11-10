const exportToExternal = {
    exportStudiesToExternal(username,orthancIDsArray, endpoint){
        const storeFtpOption = {
            method: 'POST', 
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Resources : orthancIDsArray,
                endpoint: endpoint
            })
        }

        return fetch ('/api/robot/'+username+'/export/', storeFtpOption ).then((answer) => {
            if (!answer.ok) {throw answer}
            return (answer.json())
        }).catch(error => {
            console.error(error)
        })
    }
}

export default exportToExternal