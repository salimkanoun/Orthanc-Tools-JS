var {v4:uuidv4 }= require("uuid")
const { exportFtp } = require("../controllers/export")
const ExportTask = require("../model/ExportTask")

describe('ExportTask',()=>{
    let exportTask

    it('should create export task', ()=>{
        spyOn(uuidv4).and.returnValue("7d8a9022-7e2b-4351-8e4a-15c2a41d9024")
        exportTask = new ExportTask("ftp")
        expect(exportTask.uuid).toBe("7d8a9022-7e2b-4351-8e4a-15c2a41d9024")
        expect(exportTask.protocol).toBe('ftp')
        expect(exportTask.sent).toBe(null)
        expect(exportTask.size).toBe(null)
        expect(exportTask.status).toBe(0)
        expect(new ExportTask('')).toThrow("Unsuported export protocol")
    })

    it('should set the archive info',()=>{
        exportTask.setArchive("testfolder/testarchive.zip")
        spyOn(fs, "stat").withArg("",((er,stat)=>{this.size = 45}).bind(exportTask))
        expect(exportTask.size).toBe(45)
        expect(exportTask.path).toBe("testfolder/testarchive.zip")
        expect(exportTask.name).toBe('testarchive.zip')
    })

    it('should return the listener for progress callback for ftp', ()=>{
        let f = exportTask.getFtpProgressListener()
        f({bytesOverall:12})
        expect(exportTask.sent).toBe(12)
        f({bytesOverall:14})
        expect(exportTask.sent).toBe(14)
        exportTask.sent = 0
    })

    it('should return the listener for progress callback for sftp', ()=>{
        let f = exportTask.getSftpProgressListener()
        f(12,2,0)
        expect(exportTask.sent).toBe(12)
        f(14,2,0)
        expect(exportTask.sent).toBe(14)
        exportTask.sent = 0
    })

    it('should return the listener for progress callback for webdav', ()=>{
        let f = exportTask.getSftpProgressListener()
        f(12)
        expect(exportTask.sent).toBe(12)
        f(14)
        expect(exportTask.sent).toBe(26)
        exportTask.sent = 0
    })

    it('should return object destined to be sent to the front', ()=>{
        exportTask.uuid = "7d8a9022-7e2b-4351-8e4a-15c2a41d9024"
        exportTask.status = 3
        exportTask.sent = 12
        exportTask.size = 45

        expect(exportTask.getSendable()).toBe(
            {
                uuid : "7d8a9022-7e2b-4351-8e4a-15c2a41d9024",
                status: 3,
                sent: 12,
                size: 45
            })
        
    })
})