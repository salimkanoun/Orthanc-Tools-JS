const CertificateRepo = require('../../repository/Certificate');
const fs = require('fs')

class Certificate{

    /**
     * Create the certificate in the database
     * @param label of the new certificate
     * @returns {Promise<int>} Returns a promise for the id of the new certicate
     */
    static createCertificate(label){
        return CertificateRepo.createCertificate(label).then(cert=>cert.id);
    }

    /**
     * Update the certificate of a given id
     * @param id of the certificate
     * @param label of the certificate
     * @param path of the certificate file
     * @returns {Promise<>} Returns a promise that complete once the modification is completed
     */
    static updateCertificate(id, label, path){
        return CertificateRepo.updateCertificate(id,label, path);
    }

    /**
     * Returns the certificate of a given id
     * @param id of the certificate
     * @returns {Promise<Certificate>}
     */
    static getFromId(id){
        return CertificateRepo.getFromId(id);
    }

    /**
     * Returns a list of all existing certificates
     * @returns {Promise<[Certificate]>}
     */
    static getAllCertificates(){
        return CertificateRepo.getAllCertificates();
    }

    /**
     * Removing a certificate from the database
     * @param id of the certificate
     * @returns {Promise<>}
     */
    static async deleteCertificate(id){
        let certificate = await Certificate.getFromId(id);
        if(certificate.path){
            await fs.promises.access(certificate.path, fs.constants.W_OK | fs.constants.R_OK)
                .then(async _=>{
                    await fs.promises.unlink(certificate.path);
                }).catch(()=>{});
        }
        await CertificateRepo.deleteCertificate(id);
    }

    /**
     * set the certificate content
     * @param id of the certificate
     * @param content the content of the certificate
     * @returns {Promise<>}
     */
    static setCertContent(id, content){
        let path = 'data/certificates/cert-'+Date.now()+'.cert'
        let stream = fs.createWriteStream( path, {
            autoClose:true
        });
        return new Promise((resolve,reject)=>{
            try {
                stream.write(content,()=>{resolve(path)});
            }
            catch (e) {
                reject(e);
            }

        }).then(async ()=> await Certificate.updateCertificate(id, null, path));
    }

}

module.exports = Certificate