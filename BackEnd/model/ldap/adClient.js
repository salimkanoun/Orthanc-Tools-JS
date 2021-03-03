var ActiveDirectory = require('activedirectory');
var AbstractAnnuaire = require('./abstractAnnuaire');


class ADClient extends AbstractAnnuaire {

    constructor(type, protocol, address, port, DN, password, base, user, group) {
        super()
        this.type = type,
        this.protocol = protocol
        this.address = address
        this.port = port
        this.DN = DN
        this.password = password
        this.base = base
        this.user = user

        if (group === '') {
            this.group = 'CN=*'
        } else {
            this.group = group
        }

        this.buildAD()
    }

    buildAD() {
        var config = {
            url: this.protocol + this.address + ':' + this.port,
            baseDN: this.base,
            username: this.DN,
            password: this.password
        }

        console.log(config)
        this.ad = new ActiveDirectory(config);
    }

    testSettings() {
        return this.autentification(this.DN, this.password);
    }

    getAllCorrespodences() {
        let queryFindGroupsOptions = {
            scope: 'sub',
            filter: this.group
        }

        console.log(queryFindGroupsOptions)
        return new Promise((resolve, reject) => {
            this.ad.findGroups(queryFindGroupsOptions, function (err, groups) {
                if (err) {
                    reject(err)
                    return
                }

                let res = []
                //If not empty response map it to an response array (otherwise send empty array)
                if(groups){
                    groups.forEach( (group)=>{
                        res.push(group)
                    })
                }
                resolve(res)
                return
               
            })

        })

    }

    autentification(username, password) {
        return new Promise((resolve, reject) => {
            this.ad.authenticate(username, password, function (err, auth) {
                console.log(err)
                console.log(auth)
                if (err) {
                    reject(err)
                    return
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
                console.log(err)
                console.log(isMember)
                if (err) {
                    reject('ERROR: ' + JSON.stringify(err))
                    return
                }
                resolve(isMember)
            })

        })
    }
}

module.exports = ADClient