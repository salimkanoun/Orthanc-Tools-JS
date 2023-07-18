import axios from "axios"

const instances = {

    getPreview(orthancInstanceUID) {
        return axios.post('/api/instances/', orthancInstanceUID +'/preview')
            .then(async (answer) => answer.data)
    },


}

export default instances