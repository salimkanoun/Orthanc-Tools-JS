//let {v4:uuidv4 }= require("uuid")
const {Exporter} = require("../model/Exporter")
const Orthanc = require("../model/Orthanc")
const FtpClient =  require("basic-ftp" )

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
        it('should create the export task and start the sending process',()=>{
            let orthanc = new Orthanc()
            spyOn(exporter, '_queueForSend')
            uuidv4  = jasmine.createSpy().and.callFake(()=>{
                return '7d8a9022-7e2b-4351-8e4a-15c2a41d9024'
            })
            spyOn(orthanc, 'getArchiveDicom').and.returnValue(new Promise((resolve, reject)=>
            {
                resolve('data/test45.7z')
                expect(exporter, '_queueForSend').toHaveBeenCalled()
            }))
            
            expect(exporter.ftpExport([])).toBe("7d8a9022-7e2b-4351-8e4a-15c2a41d9024")
            expect(orthanc, 'getArchiveDicom').toHaveBeenCalled()
        })
    })

    
})