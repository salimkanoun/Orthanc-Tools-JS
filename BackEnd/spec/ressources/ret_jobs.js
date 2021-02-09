module.exports = [
    {
        getState:async ()=>{
            return 'wait';
        },
        progress:async ()=>{
            return 0;
        },
        remove:async ()=>{
        },
        data:{
            creator:'creator',
            taskId : 'uuid',
            projectName : 'name',
            item : {}
        }
    }, 
    {
        getState:async ()=>{
            return 'active';
        },
        progress:async ()=>{
            return 50;
        },
        remove:async ()=>{
        },
        data:{
            creator:'creator',
            taskId : 'uuid',
            projectName : 'name',
            item : {}
        }
    },
    {
        getState:async ()=>{
            return 'completed';
        },
        progress:async ()=>{
            return 100;
        },
        finished:async ()=>{
            return 'id';
        },
        remove:async ()=>{
        },
        data:{
            creator:'creator',
            taskId : 'uuid',
            projectName : 'name',
            item : {}
        }
    },
]