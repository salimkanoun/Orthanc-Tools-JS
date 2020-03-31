var Orthanc = require('../model/Orthanc')

//SK A FAIRE EVOLUER VERS UN EXPORT DICOM TO BACKEND
var postExportDicom = async function (req, res) {
  const body = req.body
  var orthancInstance = new Orthanc()
  var date = new Date()
  const orthancID = await orthancInstance.findInOrthancByUid(body.studyUID)
  await orthancInstance.exportArchiveDicom(orthancID[0].ID, 'export' + date.getTime())
  const data = {}
  data.fileName = 'export' + date.getTime() + '.zip'
  res.json(data)
}

module.exports = { postExportDicom }
