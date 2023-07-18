import axios from "axios"

const instances = {

    getPreview(orthancInstanceUID) {
        return axios.get('/api/instances/'+ orthancInstanceUID +'/preview', {responseType : "blob"})
            .then(async (answer) => answer.data)
    },


}

export default instances