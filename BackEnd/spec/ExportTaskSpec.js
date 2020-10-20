const {ExportTask} = require('../model/ExportTask')
const uuid = require('../utils/uuid')
const fs = require('fs')

describe('ExportTask',()=>{
    let exportTask

    describe('#Constructor', ()=>{

        spies = {}

        beforeAll(()=>{
            spies.getUuid = spyOn(uuid, 'getUuid').and.returnValue("7d8a9022-7e2b-4351-8e4a-15c2a41d9024")
        })

        it('should create export task', ()=>{
            exportTask = new ExportTask("ftp")
            expect(exportTask.uuid).toBe("7d8a9022-7e2b-4351-8e4a-15c2a41d9024")
            expect(exportTask.protocol).toBe('ftp')
            expect(exportTask.sent).toBe(undefined)
            expect(exportTask.size).toBe(undefined)
            expect(exportTask.status).toBe(0)
            expect(uuid.getUuid).toHaveBeenCalled()
        })

        it('should fail to create an export task', ()=>{
            expect(()=>{new ExportTask('')}).toThrow("Unsuported export protocol")
        })
    })

    

    describe('setArchive(path)',()=>{

        spies = {}

        beforeAll(()=>{
            spies.fsStat = spyOn(fs, "stat").and.callFake((path,callback)=>{callback(null,{size:45})})
        })

        it('should set the archive info',()=>{
            exportTask.setArchive("testfolder/testarchive.zip")
            expect(exportTask.size).toBe(45)
            expect(exportTask.path).toBe("testfolder/testarchive.zip")
            expect(exportTask.name).toBe('testarchive.zip')
            expect(spies.fsStat).toHaveBeenCalled()
        })
    })


    describe('getSendable',()=>{
        it('should return object destined to be sent to the front', ()=>{
            exportTask.uuid = "7d8a9022-7e2b-4351-8e4a-15c2a41d9024"
            exportTask.status = 3
            exportTask.sent = 12
            exportTask.size = 45
    
            expect(exportTask.getSendable()).toEqual(
                {
                    uuid : "7d8a9022-7e2b-4351-8e4a-15c2a41d9024",
                    status: 3,
                    sent: 12,
                    size: 45
                })
            
        })
    })


    describe('listeners', ()=>{

        beforeEach(()=>{
            exportTask.sent = 0
        })

        describe('getFtpProgressListener()',()=>{

            it('should return the listener for progress callback for ftp', ()=>{
                let f = exportTask.getFtpProgressListener()
                f({bytesOverall:12})
                expect(exportTask.sent).toBe(12)
                f({bytesOverall:14})
                expect(exportTask.sent).toBe(14)
            })
        })

        describe('getSftpProgressListener()',()=>{
            it('should return the listener for progress callback for sftp', ()=>{
                let f = exportTask.getSftpProgressListener()
                f(12,2,0)
        
                expect(exportTask.sent).toBe(12)
                f(14,2,0)
                expect(exportTask.sent).toBe(14)
                exportTask.sent = 0
            })
        })

        describe('getWebDavProgressListener()',()=>{
            it('should return the listener for progress callback for webdav', ()=>{
                let f = exportTask.getWebDavProgressListener()
                f("chunk")
                expect(exportTask.sent).toBe(5)
                f("chunk")
                expect(exportTask.sent).toBe(10)
                exportTask.sent = 0
            })
        })
    })
})