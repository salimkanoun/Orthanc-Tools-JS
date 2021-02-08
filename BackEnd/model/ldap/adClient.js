var ActiveDirectory = require('activedirectory');
var AbstractAnnuaire = require('./abstractAnnuaire');


class ADClient extends AbstractAnnuaire {

    constructor(type, protocole, adresse, port, DN, mdp, base, user, groupe) {
        super()
        this.type = type,
            this.protocole = protocole
        this.adresse = adresse,
            this.port = port,
            this.DN = DN,
            this.mdp = mdp
        this.base = base
        this.user = user

        if (groupe === '') {
            this.groupe = 'CN=*'
        } else {
            this.groupe = groupe
        }

        this.buildAD()
    }

    buildAD() {
        var config = {
            url: this.protocole + this.adresse + ':' + this.port,
            baseDN: this.base,
            username: this.DN,
            password: this.mdp
        }

        this.ad = new ActiveDirectory(config);
    }

    testSettings() {
        return this.autentification(this.DN, this.mdp);
    }

    getAllCorrespodences() {
        var queryFindGroupsOptions = {
            scope: 'sub',
            filter: this.groupe
        }

        return new Promise((resolve, reject) => {
            this.ad.findGroups(queryFindGroupsOptions, function (err, groups) {

                if (err) {
                    reject(err)
                }

                let res = []
                if ((!groups) || (groups.length == 0)) {
                    console.log('No groups found.');
                } else {
                    for (let i = 0; i < groups.length; i++) {
                        res.push({ value: groups[i].cn, label: groups[i].cn });
                    }
                }
                resolve(res)
            })

        })

    }

    autentification(username, password) {
        return new Promise((resolve, reject) => {
            this.ad.authenticate(username, password, function (err, auth) {
                if (err) {
                    reject(err)
                }
                resolve(auth)
            })
        })
    }

    async getPermission(username, groupes) {
        //Get username
        let words = username.split('@');
        let usernameMemberOf = words[0];

        //Get groups
        let res = []
        let memberPromisesArray = []
        for (let i = 0; i < groupes.length; i++) {

            let memberPromises = this.isMemberOfPromise(usernameMemberOf, groupes[i]).then((isMember) => {
                if (isMember) { res.push(groupes[i]) }
            }).catch((error) => { console.error(error) })

            memberPromisesArray.push(memberPromises)

        }

        Promise.all(memberPromisesArray).then(() => {
            return res
        })
    }

    isMemberOfPromise(usernameMemberOf, groupe) {
        return new Promise((resolve, reject) => {

            this.ad.isUserMemberOf(usernameMemberOf, groupe, function (err, isMember) {
                if (err) {
                    reject('ERROR: ' + JSON.stringify(err))
                }
                resolve(isMember)
            })

        })
    }
}

module.exports = ADClient