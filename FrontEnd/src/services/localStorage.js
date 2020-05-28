const storage = {
    
    setlocalStorage(name, value){
        localStorage.setItem(name, value)
    },

    getLocalStorage(name){
        return localStorage.getItem(name)
    }

}

export default storage