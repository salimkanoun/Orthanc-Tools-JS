module.exports = [
    {
        getState:async ()=>{
            return 'active';
        },
        progress:async ()=>{
            return 0;
        },
        data:{
            creator:'creator',
            taskId : 'uuid',
            item : {
                orthancId : "id1"
            }
        }
    },
    {
        getState:async ()=>{
            return 'completed';
        },
        progress:async ()=>{
            return 100;
        },
        data:{
            creator:'creator',
            taskId : 'uuid',
            item : {
                orthancId : "id2"
            }
        }
    },
    {
        getState:async ()=>{
            return 'active';
        },
        progress:async ()=>{
            return 0;
        },
        data:{
            creator:'creator',
            taskId : 'other uuid',
            item : {
                orthancId : "id2"
            }
        }
    },
    {
        getState:async ()=>{
            return 'completed';
        },
        progress:async ()=>{
            return 100;
        },
        data:{
            creator:'creator',
            taskId : 'other uuid',
            item : {
                orthancId : "id2"
            }
        }
    },
    {
        getState:async ()=>{
            return 'completed';
        },
        progress:async ()=>{
            return 100;
        },
        remove : async()=>{
            return;
        },
        data:{
            creator:'creator',
            taskId : 'other uuid',
            item : {
                orthancId : "id2"
            }
        }
    }
]