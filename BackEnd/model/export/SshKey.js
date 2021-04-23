const SshKeyRepo = require("../../repository/SshKey");
const fs = require('fs');
const crypto = require('../../adapter/cryptoAdapter');

class SshKey {
    constructor(params) {
        this.id = params.id || null;
        this.label = params.label;
        this.path = params.path || null;
        this.pass = params.pass || null;

        if (this.id !== null && this.pass) {
            let pass = crypto.decryptText(this.pass)
            this.pass = decodeURIComponent(pass.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'))
        }
    }

    /**
     * Save the key to the database with the pass encrypted
     * @returns {Promise<int>} Returns a promise of the key id
     */
    async save() {
        this.id = await SshKey.saveSshKey(this);
        return this.id;
    }

    /**
     * Save the key to the database with the pass encrypted
     * @param key key to be saved to the database
     * @returns {Promise<int>} Returns a promise of the key id
     */
    static saveSshKey(key) {
        let queryFields = {...key}
        if (key.pass) {
            queryFields.pass=crypto.encryptText(key.pass)
        }
        return SshKeyRepo.saveKey(queryFields.id, queryFields.label, queryFields.path, queryFields.pass).then(sshKey => sshKey.id);
    }

    /**
     * Returns the keys from a given id
     * @param id of the key
     * @returns {Promise<SshKey>}
     */
    static getFromId(id) {
        return SshKeyRepo.getFromId(id).then(key => new SshKey(key));
    }

    /**
     * Returns all the ssh keys
     * @returns {Promise<SshKey[]>}
     */
    static getAllSshKey() {
        return SshKeyRepo.getAll().then(list => list.map(x => new SshKey(x)));
    }

    /**
     * Saves the body of the key
     * @param chunk chunk of the keys body
     * @returns {Promise<int>}
     */
    async setKeyContent(chunk) {
        let path = this.path;

        if (path) {
            await fs.promises.access(path, fs.constants.R_OK | fs.constants.W_OK)
                .then(async () => {
                    await fs.promises.unlink(path);
                }).catch(() => {
                });
        }

        path = 'data/private_key/key-' + Date.now();
        let stream = fs.createWriteStream(path);
        await new Promise((resolve, reject) => {
            stream.write(chunk, () => resolve());
        });

        this.path = path;

        return this.save();
    }

    /**
     * Deletes the ssh key
     * @returns {Promise<void>}
     */
    async deleteSshKey() {
        if (this.path) {
            await fs.promises.access(this.path, fs.constants.W_OK | fs.constants.R_OK)
                .then(async _ => {
                    await fs.promises.unlink(this.path);
                }).catch(() => {
                });
        }
        await SshKeyRepo.delete(this.id);
    }

    toJSON() {
        return {
            id: this.id,
            label: this.label,
            uploaded: !!this.path,
            pass: !!this.pass
        }
    }

}

module.exports = SshKey