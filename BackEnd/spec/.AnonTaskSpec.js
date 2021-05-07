//const OrthancQueue = require('../model/OrthancQueue');
const AnonTask = require('../model/tasks/AnonTask');
const anon_jobs = require('./ressources/anon_jobs');
const anon_tasks = require('./ressources/anon_tasks');
const {OTJSForbiddenException} = require('../Exceptions/OTJSErrors');

describe('AnonTask', () => {
    let orthancQueue = new OrthancQueue();
    let orthancQueueAnonimizeItems;
    let orthancQueueGetAnonimizationJobsSpy;
    let orthancQueueGetUserAnonimiaztionJobsSpy;
    let anonQueueGetJobsSpy;

    beforeEach(() => {
        orthancQueueAnonimizeItems = spyOn(orthancQueue, 'anonimizeItems');
        orthancQueueGetAnonimizationJobsSpy = spyOn(orthancQueue, 'getAnonimizationJobs');
        orthancQueueGetUserAnonimiaztionJobsSpy = spyOn(orthancQueue, 'getUserAnonimizationJobs');
        anonQueueGetJobsSpy = spyOn(orthancQueue.anonQueue, 'getJobs');
    });

    describe('createTask(creator, studies, endpoint, transcoding)', () => {
        it('should create a task', async () => {
            orthancQueueGetUserAnonimiaztionJobsSpy.and.returnValue([]);
            orthancQueueAnonimizeItems.and.returnValue("an uuid");
            let uuid = await AnonTask.createTask("creator", ["1", "2", "3", "4"]);
            expect(uuid).toEqual("an uuid");
            expect(orthancQueueAnonimizeItems).toHaveBeenCalledWith('creator', ["1", "2", "3", "4"]);
        });

        it('should throw OTJSForbidenException', async () => {
            orthancQueueGetUserAnonimiaztionJobsSpy.and.returnValue([anon_jobs[0]]);
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([anon_jobs[0]]);
            try {
                await AnonTask.createTask("creator", ["1", "2", "3", "4"]);
                expect(false).toBe(true, 'createTask should rasie an exception')
            } catch (e) {
                expect(e).toEqual(new OTJSForbiddenException("Cant create two anonymiztion simulteanously"));
            }
        })
    });

    describe('getTask(id)', () => {
        it('should return null', async () => {
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([]);
            let task = await AnonTask.getTask("uuid");
            expect(task).toEqual(null);
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 1/3', async () => {
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([anon_jobs[0], anon_jobs[1]]);
            let task = await AnonTask.getTask("uuid");
            expect(task).toEqual(anon_tasks[0]);
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/3', async () => {
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([anon_jobs[0]]);
            let task = await AnonTask.getTask("uuid");
            expect(task).toEqual(anon_tasks[1]);
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 3/3', async () => {
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([anon_jobs[2], anon_jobs[1]]);
            let task = await AnonTask.getTask("uuid");
            expect(task).toEqual(anon_tasks[2]);
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getUserTask(user)', () => {
        it('should return null', async () => {
            orthancQueueGetUserAnonimiaztionJobsSpy.and.returnValue([]);
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([]);
            let task = await AnonTask.getUserTask("user");
            expect(task).toEqual(null);
        });

        it('should return task 1/2', async () => {
            orthancQueueGetUserAnonimiaztionJobsSpy.and.returnValue([anon_jobs[0], anon_jobs[1]]);
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([anon_jobs[0], anon_jobs[1]]);
            let task = await AnonTask.getUserTask("creator");
            expect(task).toEqual(anon_tasks[0]);
            expect(orthancQueueGetUserAnonimiaztionJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/2', async () => {
            orthancQueueGetUserAnonimiaztionJobsSpy.and.returnValue([anon_jobs[0]]);
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([anon_jobs[0]]);
            let task = await AnonTask.getUserTask("creator");
            expect(task).toEqual(anon_tasks[1]);
            expect(orthancQueueGetUserAnonimiaztionJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetAnonimizationJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getTasks()', () => {

        it('should return []', async () => {
            anonQueueGetJobsSpy.and.returnValue([]);
            let tasks = await AnonTask.getTasks();
            expect(tasks).toEqual([]);
        });

        it('should return tasks 1/2', async () => {
            anonQueueGetJobsSpy.and.returnValue([anon_jobs[0], anon_jobs[1]]);
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([anon_jobs[0], anon_jobs[1]]);
            let tasks = await AnonTask.getTasks();
            expect(tasks).toEqual([anon_tasks[0]]);
        });

        it('should return tasks 2/2', async () => {
            anonQueueGetJobsSpy.and.returnValue([anon_jobs[0], anon_jobs[3]]);
            orthancQueueGetAnonimizationJobsSpy.and.returnValues([anon_jobs[0]], [anon_jobs[3]]);
            let tasks = await AnonTask.getTasks();
            expect(tasks).toEqual([anon_tasks[1], anon_tasks[3]]);
        });

    });

    describe('delete(id)', () => {
        it('should delete call job.remove()', async () => {
            let removeSpy = spyOn(anon_jobs[4], "remove");
            orthancQueueGetAnonimizationJobsSpy.and.returnValue([anon_jobs[4], anon_jobs[4], anon_jobs[4], anon_jobs[4]]);
            await AnonTask.delete('uuid');
            expect(removeSpy.calls.count()).toBe(4);
        })
    })
})