const Orthanc = require('../model/Orthanc')

describe('Test Orthanc', () => {
  var orthanc = null

  beforeEach(function () {
    orthanc = new Orthanc()

    spyOn(orthanc, 'removeAet').and.returnValue(true)
  })
})
