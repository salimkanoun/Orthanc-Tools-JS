var Orthanc = require('../model/Orthanc')

var getParsedAnswer = async function(req, res){

  //SK ALGO A REVOIR
  // IMPLEMENTER LE GET D INFO EN PLAIN TEXT DANS LE REVERSE PROXY
  // API DE PLUS HAUT NIVEAU POUR RECUPERER LES RESULTS D UNE QUERY
  // RETOURNE UNE REPONSE ADAPTE AU NIVEAU DE QUERY (COMME EXISTANT PRECEDEMMENT)
  // PROBABLEMENT RENOMMER CE FICHIER VU QUE LE QUERY VA DIRECTEMENT VIA LE REVERSE PROXY
  let orthanc = new Orthanc()
  orthanc.getStudyAnswerDetails()
}

var getSeriesQueryParsedAnswer = async function (req, res) {

}

module.exports = { getParsedAnswer }
