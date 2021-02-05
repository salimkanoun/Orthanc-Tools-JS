const TaskType = require('TaskType');
const { OTJSBadRequestException } = require("../Exceptions/OTJSErrors");

/**
 * Represents a task to be executed by Orthanc Tool js
 */
class Task {
    static async getTask(id){
        let task = null;
        switch(id[0]){
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
        if(task === null) {
            throw new OTJSNotFoundException("Unknown task");
        }
        return task; 
    }

    static async getUserTask(username, type){
        let task;
        switch (type) {
            case TaskType.RETRIEVE:
                task = await RetrieveTask.getUserTask(username);
                break;
            case TaskType.EXPORT:
                task = await ExportTask.getUserTask(username);
                break;
            case TaskType.ANONYMIZE:
                task = await AnonTask.getUserTask(username);
                break;
            case TaskType.DELETE:
                task = await DeleteTask.getUserTask(username);
                break;
            default:
                throw new OTJSBadRequestException('Unknown task type');
        }

        if(task===null) throw new OTJSNotFoundException("Unknown task");
        
        return task;
    }

    static async getTasksOfType(type){
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

    static async getTasks(){
        let tasks = [];
        tasks.concat(await RetrieveTask.getTasks());
        tasks.concat(await ExportTask.getTasks());
        tasks.concat(await AnonTask.getTasks());
        tasks.concat(await DeleteTask.getTasks());
        
        return tasks;
    }

    static async deleteTaskOfUser(username, type){
        let task;
        switch (type) {
            case TaskType.RETRIEVE:
                task = await RetrieveTask.getUserTask(username);
                RetrieveTask.delete(task.id);
                break;
            case TaskType.DELETE:
                task = await DeleteTask.getUserTask(username);
                DeleteTask.delete(task.id);
                break;
            case TaskType.ANONYMIZE:
                task = await AnonTask.getUserTask(username);
                AnonTask.delete(task.id);
                break;
            default:
                throw new OTJSBadRequestException('Cant delete this task');
        }
    }

    static async deleteTask(id){
        let task = null;
        switch(id[0]){
            case 'r' : 
                task = await RetrieveTask.delete(id);
                break;
            case 'a' : 
                task = await AnonTask.delete(id);
                break;
            case 'd' : 
                task = await DeleteTask.delete(id);
                break;
            default:
                throw new OTJSBadRequestException('Cant delete this task');
        }    
    }
}

module.exports = Task