//let {v4:uuidv4 }= require("uuid")
const {Exporter} = require("../model/Exporter")
const Orthanc = require("../model/Orthanc")
const FtpClient =  require("basic-ftp" )
const {ExportTask, CREATING, PENDING_SENDING} = require("../model/ExportTask")
const uuid = require("../utils/uuid")
const fs = require('fs')
const { resolve } = require("path")
const ftp = new FtpClient.Client()

describe('Exporter',()=>{
    let exporter

    describe('#Constructor', ()=>{
        it('should create the exporter', ()=>{
            exporter = new Exporter()
            expect(exporter.taskMap).toEqual({})
            expect(exporter._sending).toBe(false)
            expect(exporter._sendTaskQueue).toEqual([])
        })

        it('should give the same instance of the exporter',()=>{
            let exporter2 = new Exporter()
            expect(exporter ).toEqual(exporter2)
        })
    })
    
    describe('ftpExport(uids)',()=>{

        let spies = {}

        beforeAll(()=>{
            spies.getUuid = spyOn(uuid, 'getUuid').and.returnValue("7d8a9022-7e2b-4351-8e4a-15c2a41d9024")
            spies.getArchive = spyOn(exporter.orthanc, 'getArchiveDicom').and.callFake((ids)=>{return new Promise((resolve, reject)=>{
                resolve('path/name.7z')
            })})
            spies.fsStat = spyOn(fs, "stat").and.callFake((path,callback)=>{callback(null,{size:45})})
            spies.queueForSend = spyOn(exporter, '_queueForSend').and.callFake((tsk)=>{}) 
        })

        it('should create the export task and start the sending process',()=>{
            expect(exporter.ftpExport(['62cc4f41-9b1679c0-6ad19a2e-71fccb6f-07a3d16d'])).toBe('7d8a9022-7e2b-4351-8e4a-15c2a41d9024')
            
            let t = new ExportTask('ftps');
            t.status = CREATING;
            expect(exporter.taskMap['7d8a9022-7e2b-4351-8e4a-15c2a41d9024']).toEqual(t)

            expect(spies.getArchive).toHaveBeenCalledWith(['62cc4f41-9b1679c0-6ad19a2e-71fccb6f-07a3d16d'])
        })
    })

    describe('webdavExport(uids)',()=>{

        let spies = {}

        beforeAll(()=>{
            spies.getUuid = spyOn(uuid, 'getUuid').and.returnValue("7d8a9022-7e2b-4351-8e4a-15c2a41d9024")
            spies.getArchive = spyOn(exporter.orthanc, 'getArchiveDicom').and.callFake((ids)=>{return new Promise((resolve, reject)=>{
                resolve('path/name.7z')
            })})
            spies.fsStat = spyOn(fs, "stat").and.callFake((path,callback)=>{callback(null,{size:45})})
            spies.queueForSend = spyOn(exporter, '_queueForSend').and.callFake((tsk)=>{}) 
        })

        it('should create the export task and start the sending process',()=>{
            expect(exporter.webdavExport(['62cc4f41-9b1679c0-6ad19a2e-71fccb6f-07a3d16d'])).toBe('7d8a9022-7e2b-4351-8e4a-15c2a41d9024')
            
            let t = new ExportTask('webdav');
            t.status = CREATING;
            expect(exporter.taskMap['7d8a9022-7e2b-4351-8e4a-15c2a41d9024']).toEqual(t)

            expect(spies.getArchive).toHaveBeenCalledWith(['62cc4f41-9b1679c0-6ad19a2e-71fccb6f-07a3d16d'])
        })

        afterAll(()=>{
            exporter.taskMap={}
        })
    })

    describe('_queueForSend(task', ()=>{
        
        let spies = {}

        beforeAll(()=>{
            spies.exporterSend = spyOn(exporter,'_sendArchives').and.callFake(()=>{})
        })

        it('Should add the task to the queue and try start sending',()=>{
            let t = new ExportTask('ftps');
            exporter._queueForSend(t)
            expect(exporter._sendTaskQueue).toContain(t)
            expect(spies.exporterSend).toHaveBeenCalled()   
            expect(t.status).toBe(PENDING_SENDING) 
        })

        it('should prepend tasks',()=>{
            let t1 = new ExportTask('ftps');
            let t2 = new ExportTask('ftps');
            let t3 = new ExportTask('ftps');
            exporter._queueForSend(t1)
            exporter._queueForSend(t2)
            exporter._queueForSend(t3)
            expect(exporter._sendTaskQueue).toEqual([t3,t2,t1])
        })

        afterEach(()=>{
            exporter._sendTaskQueue = []
        })
    })

    describe('_sendArchives',()=>{
        let spies = {}

        beforeAll(()=>{
            spies.exporterSendFtp = spyOn(exporter, '_ftpSend').and.callFake((task)=>new Promise((resolve,reject)=>{resolve()}))
            spies.exporterSendSftp = spyOn(exporter, '_sftpSend').and.callFake((task)=>new Promise((resolve,reject)=>{resolve()}))
            spies.exporterSendWebdav = spyOn(exporter, '_webdavSend').and.callFake((task)=>new Promise((resolve,reject)=>{resolve()}))
        })

        beforeEach(()=>{
            spies.exporterSendFtp.calls.reset()
            spies.exporterSendSftp.calls.reset()
            spies.exporterSendWebdav.calls.reset()
        })

        it('should empty the send buffer by calling the send functions', async ()=>{
            
            let t1 = new ExportTask('ftps');
            let t2 = new ExportTask('ftp');
            let t3 = new ExportTask('sftp');
            let t4 = new ExportTask('webdav');
            
            exporter._sendTaskQueue = [t4,t3,t2,t1]

            await exporter._sendArchives();

            expect(spies.exporterSendFtp.calls.count()).toEqual(2);
            expect(spies.exporterSendSftp.calls.count()).toEqual(1);
            expect(spies.exporterSendWebdav.calls.count()).toEqual(1);
        })

        it('should treat each task in a fifo manner',async ()=>{
            let t1 = new ExportTask('ftps');
            let t2 = new ExportTask('ftps');
            let t3 = new ExportTask('ftps');
            let t4 = new ExportTask('ftps');

            exporter._sendTaskQueue = [t4,t3,t2,t1]
            
            await exporter._sendArchives();

            console.log(spies.exporterSendFtp.calls)
            expect(spies.exporterSendFtp.calls.allArgs()).toEqual([[t1],[t2],[t3],[t4]])
        })


    })

})