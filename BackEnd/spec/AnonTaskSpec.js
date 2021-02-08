const OrthancQueue = require('../model/OrthancQueue');
const AnonTask = require('../model/tasks/AnonTask');

describe('AnonTask', () => {
    let orthancQueue = new OrthancQueue();
    let orthancQueueAnonimizeItems;
    let orthancQueueGetAnonimizationJobsSpy;
    let orthancQueueGetUserAnonimiaztionJobsSpy;
    let anonQueueGetJobsSpy;

    beforeEach(()=>{
        orthancQueueAnonimizeItems = spyOn(orthancQueue, 'anonimizeItems');
        orthancQueueGetAnonimizationJobsSpy = spyOn(orthancQueue, 'getAnonimizationJobs');
        orthancQueueGetUserAnonimiaztionJobsSpy = spyOn(orthancQueue, 'getUserAnonimizationJobs');
        anonQueueGetJobsSpy = spyOn(orthancQueue.anonQueue, 'getJobs');
    });

    describe('createTask(creator, studies, endpoint, transcoding)', ()=>{
        it('should create a task',async ()=>{
            orthancQueueGetUserAnonimiaztionJobsSpy.and.returnValue([]);
            orthancQueueAnonimizeItems.and.returnValue("an uuid");
            let uuid = await AnonTask.createTask("creator", ["1","2","3","4"]);
            expect(uuid).toEqual("an uuid");
            expect(orthancQueueAnonimizeItems).toHaveBeenCalledWith('creator', ["1","2","3","4"]);
        })
    });

    describe('getTask(id)',()=>{
        it('should return null', async ()=>{
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([]);
            let task = await AnonTask.getTask("uuid");
            expect(task).toEqual(null);
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 1/3', async ()=>{
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([{
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
            },{
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
            }]);
            let task = await AnonTask.getTask("uuid");
            expect(task).toEqual({
                id : "uuid",
                type: "anonymize",
                creator: "creator",
                progress: 15,
                state : 'active',
                content: {
                    items : [
                        {
                            source : 'source1',
                            state : 'active',
                            result : null
                        },
                        {
                            source : 'source2',
                            state : 'active',
                            result : null
                        }
                    ]
                }
            });
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/3', async ()=>{
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId : 'uuid',
                    item : {
                        sourceOrthancStudyID : "source1"
                    }
                }
            }]);
            let task = await AnonTask.getTask("uuid");
            expect(task).toEqual({
                id : "uuid",
                type: "anonymize",
                creator: "creator",
                progress: 20,
                state : 'active',
                content: {
                    items : [
                        {
                            source : 'source1',
                            state : 'active',
                            result : null
                        }
                    ]
                }
            });
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 3/3', async ()=>{
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([{
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
            },{
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
                        sourceOrthancStudyID : "source2"
                    }
                }
            }]);
            let task = await AnonTask.getTask("uuid");
            expect(task).toEqual({
                id : "uuid",
                type: "anonymize",
                creator: "creator",
                progress: 60,
                state : 'active',
                content: {
                    items : [
                        {
                            source : 'source1',
                            state : 'completed',
                            result : 'new id'
                        },
                        {
                            source : 'source2',
                            state : 'active',
                            result : null
                        }
                    ]
                }
            });
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getUserTask(user)',()=>{
        it('should return null', async ()=>{
            orthancQueueGetUserAnonimiaztionJobsSpy.and.returnValue([]);
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([]);
            let task = await AnonTask.getUserTask("user");
            expect(task).toEqual(null);
        });

        it('should return task 1/2', async ()=>{
            orthancQueueGetUserAnonimiaztionJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId:"uuid",
                    item : {
                        sourceOrthancStudyID : "source1"
                    }
                }
            },{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId:"uuid",
                    item : {
                        sourceOrthancStudyID : "source2"
                    }
                }
            }]);
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId:"uuid",
                    item : {
                        sourceOrthancStudyID : "source1"
                    }
                }
            },{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId:"uuid",
                    item : {
                        sourceOrthancStudyID : "source2"
                    }
                }
            }]);
            let task = await AnonTask.getUserTask("creator");
            expect(task).toEqual({
                id : "uuid",
                type: "anonymize",
                creator: "creator",
                progress: 20,
                state : 'active',
                content: {
                    items : [
                        {
                            source : 'source1',
                            state : 'active',
                            result : null
                        },
                        {
                            source : 'source2',
                            state : 'active',
                            result : null
                        }
                    ]
                }
            });
            expect(orthancQueueGetUserAnonimiaztionJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/2', async()=>{
            orthancQueueGetUserAnonimiaztionJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 100
                },
                data:{
                    creator:'creator',
                    taskId:"uuid"
                }
            }]);
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId : 'uuid',
                    item : {
                        sourceOrthancStudyID : "source1"
                    }
                }
            }]);
            let task = await AnonTask.getUserTask("creator");
            expect(task).toEqual({
                id : "uuid",
                type: "anonymize",
                creator: "creator",
                progress: 15,
                state : 'active',
                content: {
                    items : [
                        {
                            source : 'source1',
                            state : 'active',
                            result : null
                        }
                    ]
                }
            });
            expect(orthancQueueGetUserAnonimiaztionJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getTasks()', ()=>{

        it('should return []', async ()=>{
            anonQueueGetJobsSpy.and.returnValue([]);
            let tasks = await AnonTask.getTasks();
            expect(tasks).toEqual([]);
        });

        it('should return tasks 1/2', async ()=>{
            anonQueueGetJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId : 'uuid',
                    item : {
                        sourceOrthancStudyID : "source1"
                    }
                }
            },{
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
                }
            }]);
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId : 'uuid',
                    item : {
                        sourceOrthancStudyID : "source1"
                    }
                }
            },{
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
                }
            }]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let tasks = await ExportTask.getTasks();
            expect(tasks).toEqual([{
                id : "uuid",
                type: "anonymize",
                creator: "creator",
                progress: 15,
                state : 'active',
                content: {
                    items : [
                        {
                            source : 'source1',
                            state : 'active',
                            result : null
                        },
                        {
                            source : 'source2',
                            state : 'active',
                            result : null
                        } 
                    ]
                }
            }]);
        });

        it('should return tasks 2/2', async ()=>{
            anonQueueGetJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId : 'uuid',
                    item : {
                        sourceOrthancStudyID : "source1"
                    }
                }
            },{
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
            }]);
            orthancQueueGetAnonimizationJobsSpy.and.returnValues([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId : 'uuid',
                    item : {
                        sourceOrthancStudyID : "source1"
                    }
                }
            }],[{
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
            }]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let tasks = await ExportTask.getTasks();
            expect(tasks).toEqual([{
                id : "uuid",
                type: "anonymize",
                creator: "creator",
                progress: 20,
                state : 'active',
                content: {
                    items : [
                        {
                            source : 'source1',
                            state : 'active',
                            result : null
                        } 
                    ]
                }
            },{
                id : "not uuid",
                type: "anonymize",
                creator: "not creator",
                progress: 10,
                state : 'active',
                content: {
                    items : [
                        {
                            source : 'source2',
                            state : 'active',
                            result : null
                        } 
                    ]
                }
            }]);
        });

    });
})