import { toast } from 'react-toastify';

const apis = {

    async getAets() {
        let aets = await fetch('/api/aets').then((answer) => { return answer.json() }).catch((error)=>{
            toastifyError(error)
        })
        return aets
    }

}

function toastifySuccess(message) {

    toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    })
}

function toastifyError(message){
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });
}

export default apis