module.exports = [
    {
        getState:async ()=>{
            return 'active';
        },
        progress:async ()=>{
            return 20;
        },
        data:{
            creator:'creator',
            taskId : 'uuid',
            item : {
                sourceOrthancStudyID : "source1"
            }
        }
    },
    {
        getState:async ()=>{
            return 'active';
        },
        progress:async ()=>{
            return 10;
        },
        data:{
            creator:'creator',
            taskId : 'uuid',
            item : {
                sourceOrthancStudyID : "source2"
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
                sourceOrthancStudyID : "source1"
            }
        },
        finished:async()=>{
            return 'new id';
        }
    },
    {
        getState:async ()=>{
            return 'active';
        },
        progress:async ()=>{
            return 10
        },
        data:{
            creator:'not creator',
            taskId : 'not uuid',
            item : {
                sourceOrthancStudyID : "source2"
            }
        }
    },
    {
        getState:async ()=>{
            return 'active';
        },
        progress:async ()=>{
            return 10
        },
        data:{
            creator:'creator',
            taskId : 'uuid',
            item : {
                sourceOrthancStudyID : "source2"
            }
        },
        remove: async()=>{}
    }
]