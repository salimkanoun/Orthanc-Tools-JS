import axios from "axios"

const importDicom = {

    importDicom(dicomFile) {
        return axios.post('/api/instances', dicomFile, { headers: { 'Content-Type': 'application/dicom' } })
            .then(async (answer) => answer.data)
    },

    createDicom(content, parentOrthancId, tags = {}) {

        let payload = {
            "Content": content,
            "Tags": tags,

        }
        if (parentOrthancId) {
            payload.Parent = parentOrthancId
        }

        return axios.post('/api/tools/create-dicom', payload)
            .then(async (answer) => answer.data
            ).catch(error => {
                console.error(error)
            })
    }

}

export default importDicom