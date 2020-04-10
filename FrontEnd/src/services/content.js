import { toastifyError } from "./toastify";

const query  = {

    getContent(contentSerch){
        return fetch('api/tools/find', {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contentSerch)
        }).then((response) => {
            if (!response.ok) {throw response}
            return response.json()
        }).catch((error) => {
            toastifyError(error)
        })
    }
}

export default query

