const TaskType = require('./TaskType');
const {OTJSBadRequestException, OTJSNotFoundException} = require("../Exceptions/OTJSErrors");
const AnonTask = require('./tasks/AnonTask');
const ExportTask = require('./tasks/ExportTask');
const DeleteTask = require('./tasks/DeleteTask');
const RetrieveTask = require('./tasks/RetrieveTask');

/**
 * Represents a task to be executed by Orthanc Tool js
 */
class Task {
    /**
     * Get a task with its uuid
     * @param {string} id uuid of the task
     */
    static async getTask(id) {
        let task = null;
        //Checking for task type with the first character of the task id
        switch (id[0]) {
            case 'a' :
                task = await AnonTask.getTask(id);
                break;
            case 'e' :
                task = await ExportTask.getTask(id);
                break;
            case 'd' :
                task = await DeleteTask.getTask(id);
                break;
            case 'r' :
                task = await RetrieveTask.getTask(id);
                break;
            default:
                throw new OTJSBadRequestException("Unknown task type")
        }
        if (task === null) {
            throw new OTJSNotFoundException("Unknown task");
        }
        return task;
    }

    /**
     * Get a task with its creator and with its type
     * @param {string} username username of the creator of the task
     * @param {string} type type of the task
     */
    static async getUserTask(username, type) {
        let task;
        switch (type) {
            case TaskType.RETRIEVE:
                task = await RetrieveTask.getUserTask(username);
                break;
            case TaskType.EXPORT:
                task = [await ExportTask.getUserTask(username)];
                break;
            case TaskType.ANONYMIZE:
                task = await AnonTask.getUserTask(username);
                break;
            case TaskType.DELETE:
                task = [await DeleteTask.getUserTask(username)];
                break;
            default:
                throw new OTJSBadRequestException('Unknown task type');
        }

        if (task === null) throw new OTJSNotFoundException("Unknown task");

        return task;
    }

    /**
     * Get all tasks of a given type
     * @param {string} type type of the task
     */
    static async getTasksOfType(type) {
        let tasks;
        switch (type) {
            case TaskType.RETRIEVE:
                tasks = await RetrieveTask.getTasks();
                break;
            case TaskType.EXPORT:
                tasks = await ExportTask.getTasks();
                break;
            case TaskType.ANONYMIZE:
                tasks = await AnonTask.getTasks();
                break;
            case TaskType.DELETE:
                tasks = await DeleteTask.getTasks();
                break;
            default:
                throw new OTJSBadRequestException('Unknown task type');
        }
        return tasks;
    }

    /**
     * Get all tasks
     */
    static async getTasks() {
        let tasks = [];
        tasks = tasks.concat(await RetrieveTask.getTasks());
        tasks = tasks.concat(await ExportTask.getTasks());
        tasks = tasks.concat(await AnonTask.getTasks());
        tasks = tasks.concat(await DeleteTask.getTasks());

        return tasks;
    }

    /**
     * Delete a task given its creator and its type
     * @param {string} username creator of the task to be deleted
     * @param {string} type type of the task to be deleted
     */
    static async deleteTaskOfUser(username, type) {
        let task;
        switch (type) {
            case TaskType.RETRIEVE:
                task = await RetrieveTask.getUserTask(username)[0];
                if (!task) throw new OTJSNotFoundException('Unknown task');
                RetrieveTask.delete(task.id);
                break;
            case TaskType.DELETE:
                task = await DeleteTask.getUserTask(username);
                if (!task) throw new OTJSNotFoundException('Unknown task');
                DeleteTask.delete(task.id);
                break;
            case TaskType.ANONYMIZE:
                task = await AnonTask.getUserTask(username)[0];
                if (!task) throw new OTJSNotFoundException('Unknown task');
                AnonTask.delete(task.id);
                break;
            default:
                throw new OTJSBadRequestException('Cant delete this task');
        }
    }

    /**
     * Delete the task of a given id
     * @param {string} id uuid of the task to be deleted
     */
    static async deleteTask(id) {
        //Checking for task type with the first character of the task id
        switch (id[0]) {
            case 'r' :
                await RetrieveTask.delete(id);
                break;
            case 'a' :
                await AnonTask.delete(id);
                break;
            case 'd' :
                await DeleteTask.delete(id);
                break;
            default:
                throw new OTJSBadRequestException('Cant delete this task');
        }
    }

    static async flushTasks(type) {
        switch (type) {
            case TaskType.RETRIEVE:
                await RetrieveTask.flush();
                break;
            case TaskType.DELETE:
                await DeleteTask.flush();
                break;
            case TaskType.ANONYMIZE:
                await AnonTask.flush();
                break;
            case TaskType.EXPORT:
                await ExportTask.flush();
                break;
            default:
                throw new OTJSBadRequestException('This task type');
        }
    }
}

module.exports = Task