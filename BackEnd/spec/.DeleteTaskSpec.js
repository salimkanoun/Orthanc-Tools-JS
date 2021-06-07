//const OrthancQueue = require('../model/OrthancQueue');
const del_jobs = require('./ressources/del_jobs');
const del_tasks = require('./ressources/del_tasks');
const {OTJSForbiddenException} = require('../Exceptions/OTJSErrors');
const DeleteTask = require('../model/tasks/DeleteTask');

describe('DeleteTask', () => {
    let orthancQueue = new OrthancQueue();
    let orthancQueueDeleteItemsJobs;
    let orthancQueueGetDeleteJobsSpy;
    let orthancQueueGetUserDeleteJobsSpy;
    let deleteQueueGetJobsSpy;

    beforeEach(() => {
        orthancQueueDeleteItemsJobs = spyOn(orthancQueue, 'deleteItems');
        orthancQueueGetDeleteJobsSpy = spyOn(orthancQueue, 'getDeleteJobs');
        orthancQueueGetUserDeleteJobsSpy = spyOn(orthancQueue, 'getUserDeleteJobs');
        deleteQueueGetJobsSpy = spyOn(orthancQueue.deleteQueue, 'getJobs');
    });

    describe('createTask(creator, studies, endpoint, transcoding)', () => {
        it('should create a task', async () => {
            orthancQueueGetUserDeleteJobsSpy.and.returnValue([]);
            orthancQueueDeleteItemsJobs.and.returnValue("an uuid");
            let uuid = await DeleteTask.createTask("creator", ["1", "2", "3", "4"]);
            expect(uuid).toEqual("an uuid");
            expect(orthancQueueDeleteItemsJobs).toHaveBeenCalledWith('creator', ["1", "2", "3", "4"]);
        });

        it('should throw OTJSForbidenException', async () => {
            orthancQueueGetUserDeleteJobsSpy.and.returnValue([del_jobs[0]]);
            orthancQueueGetDeleteJobsSpy.and.returnValue([del_jobs[0]]);
            try {
                await DeleteTask.createTask("creator", ["1", "2", "3", "4"]);
                expect(false).toBe(true, 'createTask should rasie an exception');
            } catch (e) {
                expect(e).toEqual(new OTJSForbiddenException("Cant create two deletion simulteanously"));
            }
        })
    });

    describe('getTask(id)', () => {
        it('should return null', async () => {
            orthancQueueGetDeleteJobsSpy.and.returnValue([]);
            let task = await DeleteTask.getTask("uuid");
            expect(task).toEqual(null);
            expect(orthancQueueGetDeleteJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 1/3', async () => {
            orthancQueueGetDeleteJobsSpy.and.returnValue([del_jobs[0], del_jobs[0]]);
            let task = await DeleteTask.getTask("uuid");
            expect(task).toEqual(del_tasks[0]);
            expect(orthancQueueGetDeleteJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/3', async () => {
            orthancQueueGetDeleteJobsSpy.and.returnValue([del_jobs[0], del_jobs[1]]);
            let task = await DeleteTask.getTask("uuid");
            expect(task).toEqual(del_tasks[1]);
            expect(orthancQueueGetDeleteJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 3/3', async () => {
            orthancQueueGetDeleteJobsSpy.and.returnValue([del_jobs[1], del_jobs[1]]);
            let task = await DeleteTask.getTask("uuid");
            expect(task).toEqual(del_tasks[2]);
            expect(orthancQueueGetDeleteJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getUserTask(user)', () => {
        it('should return null', async () => {
            orthancQueueGetUserDeleteJobsSpy.and.returnValue([]);
            orthancQueueGetDeleteJobsSpy.and.returnValue([]);
            let task = await DeleteTask.getUserTask("user");
            expect(task).toEqual(null);
        });

        it('should return task 1/2', async () => {
            orthancQueueGetUserDeleteJobsSpy.and.returnValue([del_jobs[0], del_jobs[1]]);
            orthancQueueGetDeleteJobsSpy.and.returnValue([del_jobs[0], del_jobs[1]]);
            let task = await DeleteTask.getUserTask("creator");
            expect(task).toEqual(del_tasks[1]);
            expect(orthancQueueGetUserDeleteJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetDeleteJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/2', async () => {
            orthancQueueGetUserDeleteJobsSpy.and.returnValue([del_jobs[0]]);
            orthancQueueGetDeleteJobsSpy.and.returnValue([del_jobs[0]]);
            let task = await DeleteTask.getUserTask("creator");
            expect(task).toEqual(del_tasks[0]);
            expect(orthancQueueGetUserDeleteJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetDeleteJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getTasks()', () => {

        it('should return []', async () => {
            deleteQueueGetJobsSpy.and.returnValue([]);
            let tasks = await DeleteTask.getTasks();
            expect(tasks).toEqual([]);
        });

        it('should return tasks 1/2', async () => {
            deleteQueueGetJobsSpy.and.returnValue([del_jobs[0], del_jobs[1]]);
            orthancQueueGetDeleteJobsSpy.and.returnValue([del_jobs[0], del_jobs[1]]);
            let tasks = await DeleteTask.getTasks();
            expect(tasks).toEqual([del_tasks[1]]);
        });

        it('should return tasks 2/2', async () => {
            deleteQueueGetJobsSpy.and.returnValue([del_jobs[0], del_jobs[1], del_jobs[2], del_jobs[3]]);
            orthancQueueGetDeleteJobsSpy.and.returnValues([del_jobs[0], del_jobs[1]], [del_jobs[2], del_jobs[3]]);
            let tasks = await DeleteTask.getTasks();
            expect(tasks).toEqual([del_tasks[1], del_tasks[3]]);
        });

    });

    describe('delete(id)', () => {
        it('should delete call job.remove()', async () => {
            let removeSpy = spyOn(del_jobs[4], "remove");
            orthancQueueGetDeleteJobsSpy.and.returnValue([del_jobs[4], del_jobs[4], del_jobs[4], del_jobs[4]]);
            await DeleteTask.delete('uuid');
            expect(removeSpy.calls.count()).toBe(4);
            expect(orthancQueueGetDeleteJobsSpy).toHaveBeenCalledWith("uuid");
        })
    })
})