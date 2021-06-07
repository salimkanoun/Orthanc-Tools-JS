const importDicom = {

    importDicom(dicomFile) {

        let importDicomFile = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/dicom'
            },
            body: dicomFile
        }

        return fetch('/api/instances', importDicomFile)
            .then(async (answer) => {
                if (!answer.ok) { throw answer }
                return (answer.json())
            })
    },

    createDicom( content, parentOrthancId, tags = {} ) {
        
        let payload = {
            "Content": content,
            "Tags":  tags,
            "Parent" : parentOrthancId
        }

        let createDicom = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        }

        console.log(createDicom)

        return fetch('/api/tools/create-dicom', createDicom)
            .then(async (answer) => {
                if (!answer.ok) { throw await answer.json() }
                return (answer.json())
            }).catch(error => {
                console.error(error)
            })


    }

}

export default importDicom