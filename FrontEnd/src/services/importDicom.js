import axios from "axios"

const importDicom = {

    importDicom(dicomFile) {

        let importDicomFile = {
            method: 'POST',
            body: dicomFile
        }

        return axios.post('/api/instances', importDicomFile)
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
            body: JSON.stringify(payload)
        }

        console.log(createDicom)

        return axios.post('/api/tools/create-dicom', createDicom)
            .then(async (answer) => {
                if (!answer.ok) { throw await answer.json() }
                return (answer.json())
            }).catch(error => {
                console.error(error)
            })


    }

}

export default importDicom