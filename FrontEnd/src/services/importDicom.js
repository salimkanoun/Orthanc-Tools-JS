import updateOptions from '../authorizedOption'

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

        return fetch('/api/instances', updateOptions(importDicomFile))
            .then(async (answer) => {
                if (!answer.ok) { throw await answer.json() }
                return (answer.json())
            })
    }

}

export default importDicom