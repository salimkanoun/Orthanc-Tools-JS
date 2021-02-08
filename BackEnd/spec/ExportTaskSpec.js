const Exporter = require('../model/export/Exporter');
const OrthancQueue = require('../model/OrthancQueue');
const ExportTask = require('../model/tasks/ExportTask');

describe('ExportTask', () => {
    let exporter = new Exporter();
    let orthancQueue = new OrthancQueue();
    let orthancQueueExportToEndpointSpy;
    let orthancQueueGetArchiveCreationJobsSpy;
    let exporterGetUploadJobsSpy;
    let orthancQueueGetUserArchiveCreationJobsSpy;
    let exportQueueGetJobsSpy;

    beforeEach(()=>{
        orthancQueueExportToEndpointSpy = spyOn(orthancQueue, 'exportToEndpoint');
        orthancQueueGetArchiveCreationJobsSpy = spyOn(orthancQueue, 'getArchiveCreationJobs');
        exporterGetUploadJobsSpy = spyOn(exporter, 'getUploadJobs');
        orthancQueueGetUserArchiveCreationJobsSpy = spyOn(orthancQueue, 'getUserArchiveCreationJobs');
        exportQueueGetJobsSpy = spyOn(orthancQueue.exportQueue, 'getJobs');
    });

    describe('createTask(creator, studies, endpoint, transcoding)', ()=>{
        it('should create a task',async ()=>{
            orthancQueueExportToEndpointSpy.and.returnValue("an uuid");
            let uuid = await ExportTask.createTask("creator", ["1","2","3","4"], { id:0 }, null );
            expect(uuid).toEqual("an uuid");
            expect(orthancQueueExportToEndpointSpy).toHaveBeenCalledWith('creator', ["1","2","3","4"], null, { id:0 });
        })
    });

    describe('getTask(id)',()=>{
        it('should return null', async ()=>{
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let task = await ExportTask.getTask("uuid");
            expect(task).toEqual(null);
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 1/4', async ()=>{
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator'
                }
            }]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let task = await ExportTask.getTask("uuid");
            expect(task).toEqual({
                id : "uuid",
                type: "export",
                creator: "creator",
                progress: {
                    archiving : 20,
                    sending : 0
                },
                state : 'archiving',
                content: {}
            });
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/4', async ()=>{
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'completed';
                },
                progress:async ()=>{
                    return 100
                },
                data:{
                    creator:'creator'
                }
            }]);
            exporterGetUploadJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator'
                }
            }]);
            let task = await ExportTask.getTask("uuid");
            expect(task).toEqual({
                id : "uuid",
                type: "export",
                creator: "creator",
                progress: {
                    archiving : 100,
                    sending : 20
                },
                state : 'sending',
                content: {}
            });
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 3/4', async ()=>{
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'completed';
                },
                progress:async ()=>{
                    return 100
                },
                data:{
                    creator:'creator'
                }
            }]);
            exporterGetUploadJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'completed';
                },
                progress:async ()=>{
                    return 100
                },
                data:{
                    creator:'creator'
                }
            }]);
            let task = await ExportTask.getTask("uuid");
            expect(task).toEqual({
                id : "uuid",
                type: "export",
                creator: "creator",
                progress: {
                    archiving : 100,
                    sending : 100
                },
                state : 'completed',
                content: {}
            });
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 4/4', async ()=>{
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator'
                }
            }]);
            exporterGetUploadJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'complete';
                },
                progress:async ()=>{
                    return 100
                },
                data:{
                    creator:'creator'
                }
            }]);
            let task = await ExportTask.getTask("uuid");
            expect(task).toEqual({
                id : "uuid",
                type: "export",
                creator: "creator",
                progress: {
                    archiving : 20,
                    sending : 100
                },
                state : 'failed',
                content: {}
            });
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getUserTask(user)',()=>{
        it('should return null', async ()=>{
            orthancQueueGetUserArchiveCreationJobsSpy.and.returnValue([]);
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let task = await ExportTask.getUserTask("user");
            expect(task).toEqual(null);
        });

        it('should return task 1/2', async ()=>{
            orthancQueueGetUserArchiveCreationJobsSpy.and.returnValue([{
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
            }]);
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([{
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
            }]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let task = await ExportTask.getUserTask("creator");
            expect(task).toEqual({
                id : "uuid",
                type: "export",
                creator: "creator",
                progress: {
                    archiving : 20,
                    sending : 0
                },
                state : 'archiving',
                content: {}
            });
            expect(orthancQueueGetUserArchiveCreationJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/2', async()=>{
            orthancQueueGetUserArchiveCreationJobsSpy.and.returnValue([{
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
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([{
                getState:async ()=>{
                    return 'completed';
                },
                progress:async ()=>{
                    return 100
                },
                data:{
                    creator:'creator',
                    taskId:"uuid"
                }
            }]);
            exporterGetUploadJobsSpy.and.returnValue([{
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
            }]);
            let task = await ExportTask.getUserTask("creator");
            expect(task).toEqual({
                id : "uuid",
                type: "export",
                creator: "creator",
                progress: {
                    archiving : 100,
                    sending : 20
                },
                state : 'sending',
                content: {}
            });
            expect(orthancQueueGetUserArchiveCreationJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getTasks()', ()=>{

        it('should return []', async ()=>{
            exportQueueGetJobsSpy.and.returnValue([]);
            let tasks = await ExportTask.getTasks();
            expect(tasks).toEqual([]);
        });

        it('should return tasks 1/2', async ()=>{
            exportQueueGetJobsSpy.and.returnValue([{
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
            }]);
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([{
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
            }]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let tasks = await ExportTask.getTasks();
            expect(tasks).toEqual([{
                id : "uuid",
                type: "export",
                creator: "creator",
                progress: {
                    archiving : 20,
                    sending : 0
                },
                state : 'archiving',
                content: {}
            }]);
        });

        it('should return tasks 2/2', async ()=>{
            exportQueueGetJobsSpy.and.returnValue([{
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
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId:"uuid2"
                }
            },
            ]);
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([{
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
            },{
                getState:async ()=>{
                    return 'active';
                },
                progress:async ()=>{
                    return 20
                },
                data:{
                    creator:'creator',
                    taskId:"uuid2"
                }
            }]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let tasks = await ExportTask.getTasks();
            expect(tasks).toEqual([{
                id : "uuid",
                type: "export",
                creator: "creator",
                progress: {
                    archiving : 20,
                    sending : 0
                },
                state : 'archiving',
                content: {}
            }, {
                id : "uuid2",
                type: "export",
                creator: "creator",
                progress: {
                    archiving : 20,
                    sending : 0
                },
                state : 'archiving',
                content: {}
            }]);
        });

    });
})