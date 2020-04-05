const Orthanc = require('../model/Orthanc')
const ReverseProxy = require('../model/ReverseProxy')
const WriteStream = require('fs').WriteStream

describe('Test Orthanc', () => {
  var orthanc = null

  beforeEach(function () {
    orthanc = new Orthanc()

    reverseProxyGetSpy  = spyOn(ReverseProxy, 'getAnswer')
    reversePoxyStreamToFileSpy = spyOn(ReverseProxy, 'streamToFile')
  })

  it('should call Orthanc System API', () =>{
    reverseProxyGetSpy.and.returnValue({
      DicomAet : "testAET"
    })
    orthanc.getOrthancAetName()
    expect(reverseProxyGetSpy).toHaveBeenCalledWith('/system', 'GET', undefined)
  })

  it('should export DICOM to disk', ( ) => {
    orthanc.exportArchiveDicom(['a','b', 'c'] , 'myFileName')
    expect(reversePoxyStreamToFileSpy).toHaveBeenCalledWith('/tools/create-archive', 'POST',  ['a','b', 'c'],  jasmine.any(WriteStream))
  })

  
})
