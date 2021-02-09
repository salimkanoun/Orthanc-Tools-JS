module.exports = [
    {
        getState:async ()=>{
            return 'active';
        },
        progress:async ()=>{
            return 20
        },
        data:{
            creator:'creator',
            taskId:"uuid"
        }
    },
    {
        getState:async ()=>{
            return 'completed';
        },
        progress:async ()=>{
            return 100
        },
        data:{
            creator:'creator'
        }
    }
]