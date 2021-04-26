const Exporter = require('../model/export/Exporter');
//const OrthancQueue = require('../model/OrthancQueue');
const ExportTask = require('../model/tasks/ExportTask');
const archive_jobs = require('./ressources/archive_jobs');
const send_jobs = require('./ressources/send_jobs');
const export_tasks = require('./ressources/export_tasks');

describe('ExportTask', () => {
    let exporter = new Exporter();
    let orthancQueue = new OrthancQueue();
    let orthancQueueExportToEndpointSpy;
    let orthancQueueGetArchiveCreationJobsSpy;
    let exporterGetUploadJobsSpy;
    let orthancQueueGetUserArchiveCreationJobsSpy;
    let exportQueueGetJobsSpy;

    beforeEach(() => {
        orthancQueueExportToEndpointSpy = spyOn(orthancQueue, 'exportToEndpoint');
        orthancQueueGetArchiveCreationJobsSpy = spyOn(orthancQueue, 'getArchiveCreationJobs');
        exporterGetUploadJobsSpy = spyOn(exporter, 'getUploadJobs');
        orthancQueueGetUserArchiveCreationJobsSpy = spyOn(orthancQueue, 'getUserArchiveCreationJobs');
        exportQueueGetJobsSpy = spyOn(orthancQueue.exportQueue, 'getJobs');
    });

    describe('createTask(creator, studies, endpoint, transcoding)', () => {
        it('should create a task', async () => {
            orthancQueueExportToEndpointSpy.and.returnValue("an uuid");
            let uuid = await ExportTask.createTask("creator", ["1", "2", "3", "4"], {id: 0}, null);
            expect(uuid).toEqual("an uuid");
            expect(orthancQueueExportToEndpointSpy).toHaveBeenCalledWith('creator', ["1", "2", "3", "4"], null, {id: 0});
        })
    });

    describe('getTask(id)', () => {
        it('should return null', async () => {
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let task = await ExportTask.getTask("uuid");
            expect(task).toEqual(null);
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 1/4', async () => {
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([archive_jobs[0]]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let task = await ExportTask.getTask("uuid");
            expect(task).toEqual(export_tasks[0]);
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/4', async () => {
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([archive_jobs[1]]);
            exporterGetUploadJobsSpy.and.returnValue([send_jobs[0]]);
            let task = await ExportTask.getTask("uuid");
            expect(task).toEqual(export_tasks[1]);
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 3/4', async () => {
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([archive_jobs[1]]);
            exporterGetUploadJobsSpy.and.returnValue([send_jobs[1]]);
            let task = await ExportTask.getTask("uuid");
            expect(task).toEqual(export_tasks[3]);
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 4/4', async () => {
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([archive_jobs[0]]);
            exporterGetUploadJobsSpy.and.returnValue([send_jobs[1]]);
            let task = await ExportTask.getTask("uuid");
            expect(task).toEqual(export_tasks[4]);
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getUserTask(user)', () => {
        it('should return null', async () => {
            orthancQueueGetUserArchiveCreationJobsSpy.and.returnValue([]);
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let task = await ExportTask.getUserTask("user");
            expect(task).toEqual(null);
        });

        it('should return task 1/2', async () => {
            orthancQueueGetUserArchiveCreationJobsSpy.and.returnValue([archive_jobs[0]]);
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([archive_jobs[0]]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let task = await ExportTask.getUserTask("creator");
            expect(task).toEqual(export_tasks[0]);
            expect(orthancQueueGetUserArchiveCreationJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });

        it('should return task 2/2', async () => {
            orthancQueueGetUserArchiveCreationJobsSpy.and.returnValue([archive_jobs[1]]);
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([archive_jobs[1]]);
            exporterGetUploadJobsSpy.and.returnValue([send_jobs[0]]);
            let task = await ExportTask.getUserTask("creator");
            expect(task).toEqual(export_tasks[1]);
            expect(orthancQueueGetUserArchiveCreationJobsSpy).toHaveBeenCalledWith("creator");
            expect(orthancQueueGetArchiveCreationJobsSpy).toHaveBeenCalledWith("uuid");
            expect(exporterGetUploadJobsSpy).toHaveBeenCalledWith("uuid");
        });
    });

    describe('getTasks()', () => {

        it('should return []', async () => {
            exportQueueGetJobsSpy.and.returnValue([]);
            let tasks = await ExportTask.getTasks();
            expect(tasks).toEqual([]);
        });

        it('should return tasks 1/2', async () => {
            exportQueueGetJobsSpy.and.returnValue([archive_jobs[0]]);
            orthancQueueGetArchiveCreationJobsSpy.and.returnValue([archive_jobs[0]]);
            exporterGetUploadJobsSpy.and.returnValue([]);
            let tasks = await ExportTask.getTasks();
            expect(tasks).toEqual([export_tasks[0]]);
        });

        it('should return tasks 2/2', async () => {
            exportQueueGetJobsSpy.and.returnValue([archive_jobs[0], archive_jobs[0], archive_jobs[2]]);
            orthancQueueGetArchiveCreationJobsSpy.and.returnValues([archive_jobs[0]], [archive_jobs[2]]);
            exporterGetUploadJobsSpy.and.returnValues([], []);
            let tasks = await ExportTask.getTasks();
            expect(tasks).toEqual([export_tasks[0], export_tasks[2]]);
        });

    });
})