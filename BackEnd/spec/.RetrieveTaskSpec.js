//const OrthancQueue = require('../model/OrthancQueue');
const val_jobs = require('./ressources/val_jobs');
const ret_jobs = require('./ressources/ret_jobs');
const retrieve_task = require('./ressources/retrieve_tasks');
const {OTJSForbiddenException} = require('../Exceptions/OTJSErrors');
const RetrieveTask = require('../model/tasks/RetrieveTask');

describe('RetrieveTask', () => {
    let orthancQueue = new OrthancQueue();
    let orthancQueueValidateItemsSpy;
    let orthancQueueGetValidationJobsSpy;
    let orthancQueueGetRetrieveJobsSpy;
    let orthancQueueGetUserValidationJobsSpy;
    let validationQueueGetJobsSpy;

    beforeEach(() => {
        orthancQueueValidateItemsSpy = spyOn(orthancQueue, 'validateItems');
        orthancQueueGetValidationJobsSpy = spyOn(orthancQueue, 'getValidationJobs');
        orthancQueueGetRetrieveJobsSpy = spyOn(orthancQueue, 'getRetrieveItem');
        orthancQueueGetUserValidationJobsSpy = spyOn(orthancQueue, 'getUserValidationJobs');
        validationQueueGetJobsSpy = spyOn(orthancQueue.validationQueue, 'getJobs');
    });

    describe('createTask(creator, studies, endpoint, transcoding)', () => {
        it('should create a task', async () => {
            orthancQueueGetUserValidationJobsSpy.and.returnValue([]);
            orthancQueueValidateItemsSpy.and.returnValue("an uuid");
            let uuid = await RetrieveTask.createTask("creator", "name", [{}, {}, {}, {}]);
            expect(uuid).toEqual("an uuid");
            expect(orthancQueueValidateItemsSpy).toHaveBeenCalledWith('creator', "name", [{}, {}, {}, {}]);
        });


        it('should throw OTJSForbidenException', async () => {
            orthancQueueGetUserValidationJobsSpy.and.returnValue([val_jobs[0]]);
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[0]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([]);
            try {
                await RetrieveTask.createTask("creator", "name", [{}, {}, {}, {}]);
                expect(false).toBe(true, 'createTask should rasie an exception')
            } catch (e) {
                expect(e).toEqual(new OTJSForbiddenException("Cant create two retrieval simulteanously"));
            }
        })
    });

    describe('getTask(id)', () => {
        it('should return null', async () => {
            orthancQueueGetValidationJobsSpy.and.returnValue([]);
            let task = await RetrieveTask.getTask("uuid");
            expect(task).toEqual(null);
            expect(orthancQueueGetValidationJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 1/3', async () => {
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[0], val_jobs[1], val_jobs[2]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([]);
            let task = await RetrieveTask.getTask("uuid");
            expect(task).toEqual(retrieve_task[0]);
            expect(orthancQueueGetValidationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(orthancQueueGetRetrieveJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/3', async () => {
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[2], val_jobs[2]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([ret_jobs[0], ret_jobs[1]]);
            let task = await RetrieveTask.getTask("uuid");
            expect(task).toEqual(retrieve_task[1]);
            expect(orthancQueueGetValidationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(orthancQueueGetRetrieveJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 3/3', async () => {
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[2], val_jobs[2]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([ret_jobs[2], ret_jobs[2]]);
            let task = await RetrieveTask.getTask("uuid");
            expect(task).toEqual(retrieve_task[2]);
            expect(orthancQueueGetValidationJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getUserTask(user)', () => {
        it('should return null', async () => {
            orthancQueueGetUserValidationJobsSpy.and.returnValue([]);
            orthancQueueGetValidationJobsSpy.and.returnValue([]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([]);
            let task = await RetrieveTask.getUserTask("user");
            expect(task).toEqual(null);
        });

        it('should return task 1/2', async () => {
            orthancQueueGetUserValidationJobsSpy.and.returnValue([val_jobs[0], val_jobs[1], val_jobs[2]]);
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[0], val_jobs[1], val_jobs[2]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([]);
            let task = await RetrieveTask.getUserTask("creator");
            expect(task).toEqual(retrieve_task[0]);
            expect(orthancQueueGetUserValidationJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetValidationJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/2', async () => {
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[2], val_jobs[2]]);
            orthancQueueGetUserValidationJobsSpy.and.returnValue([val_jobs[2], val_jobs[2]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([ret_jobs[2], ret_jobs[2]]);
            let task = await RetrieveTask.getUserTask("creator");
            expect(task).toEqual(retrieve_task[2]);
            expect(orthancQueueGetUserValidationJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetValidationJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getTasks()', () => {

        it('should return []', async () => {
            validationQueueGetJobsSpy.and.returnValue([]);
            let tasks = await RetrieveTask.getTasks();
            expect(tasks).toEqual([]);
        });

        it('should return tasks 1/2', async () => {
            validationQueueGetJobsSpy.and.returnValue([val_jobs[2], val_jobs[2]]);
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[2], val_jobs[2]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([ret_jobs[2], ret_jobs[2]]);
            let tasks = await RetrieveTask.getTasks();
            expect(tasks).toEqual([retrieve_task[2]]);
        });

        it('should return tasks 2/2', async () => {
            validationQueueGetJobsSpy.and.returnValue([val_jobs[0], val_jobs[1], val_jobs[2], val_jobs[3]]);
            orthancQueueGetValidationJobsSpy.and.returnValues([val_jobs[0], val_jobs[1], val_jobs[2]], [val_jobs[3]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValues([], []);
            let tasks = await RetrieveTask.getTasks();
            expect(tasks).toEqual([retrieve_task[0], retrieve_task[3]]);
        });

    });

    describe('delete(id)', () => {
        it('should delete call job.remove()', async () => {
            let vRemoveSpy = spyOn(val_jobs[2], "remove");
            let rRemoveSpy = spyOn(ret_jobs[2], "remove");
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[2], val_jobs[2], val_jobs[2], val_jobs[2]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([ret_jobs[2], ret_jobs[2], ret_jobs[2], ret_jobs[2]]);
            await RetrieveTask.delete('uuid');
            expect(vRemoveSpy.calls.count()).toBe(4);
            expect(rRemoveSpy.calls.count()).toBe(4);
        });
        it('should delete call job.remove()', async () => {
            let vRemoveSpy = spyOn(val_jobs[0], "remove");
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[0], val_jobs[0]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([]);
            await RetrieveTask.delete('uuid');
            expect(vRemoveSpy.calls.count()).toBe(2);

        });
        it('should throw an error', async () => {
            let vRemoveSpy = spyOn(val_jobs[1], "remove");
            let rRemoveSpy = spyOn(ret_jobs[1], "remove");
            let vRemoveSpyb = spyOn(val_jobs[2], "remove");
            let rRemoveSpyb = spyOn(ret_jobs[2], "remove");
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[1], val_jobs[2]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([ret_jobs[1], val_jobs[2]]);
            try {
                await RetrieveTask.delete('uuid');
                expect(false).toBe(true, "Expected delete to throw an error");
            } catch (e) {
                expect(e).toEqual(new OTJSForbiddenException("Can't delete a robot already in progress"));
            }
            expect(vRemoveSpy.calls.count()).toBe(0);
            expect(rRemoveSpy.calls.count()).toBe(0);
            expect(vRemoveSpyb.calls.count()).toBe(0);
            expect(rRemoveSpyb.calls.count()).toBe(0);
        });
    })

    describe('deleteItem(taskId, itemId)', () => {
        it('should delete call job.remove()', async () => {
            let vRemoveSpy = spyOn(val_jobs[0], "remove");
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[0], val_jobs[0]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([]);
            await RetrieveTask.delete('uuid', 3);
            expect(vRemoveSpy.calls.count()).toBe(2);

        });
        it('should throw an error', async () => {
            let vRemoveSpy = spyOn(val_jobs[2], "remove");
            let rRemoveSpy = spyOn(ret_jobs[1], "remove");
            orthancQueueGetValidationJobsSpy.and.returnValue([val_jobs[2]]);
            orthancQueueGetRetrieveJobsSpy.and.returnValue([ret_jobs[1]]);
            try {
                await RetrieveTask.delete('uuid');
                expect(false).toBe(true, "Expected delete to throw an error");
            } catch (e) {
                expect(e).toEqual(new OTJSForbiddenException("Can't delete a robot already in progress"));
            }
            expect(vRemoveSpy.calls.count()).toBe(0);
            expect(rRemoveSpy.calls.count()).toBe(0);
        });
    })
})