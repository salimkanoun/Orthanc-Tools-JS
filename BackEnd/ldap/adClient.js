var ActiveDirectory = require('activedirectory');
var AbstractAnnuaire = require ('./abstractAnnuaire');


class ADClient extends AbstractAnnuaire {
    
    constructor(type, protocole,  adresse, port, DN, mdp, base, user, groupe) {
            super()
            this.type = type,
            this.protocole = protocole
            this.adresse = adresse,
            this.port = port,
            this.DN = DN,
            this.mdp = mdp
            this.base = base
            this.user = user
            
            if(groupe === '') {
                this.groupe = 'CN=*'
            } else {
                this.groupe = groupe
            }

            this.buildAD()
    }

    buildAD() {
            var config = { url: this.protocole + this.adresse + ':' + this.port,
            baseDN: this.base,
            username: this.DN,
            password: this.mdp 
            }

            this.ad = new ActiveDirectory(config);
    }

    testSettings(callback) {
        try {
            var username = this.DN;
            var password = this.mdp;

            this.ad.authenticate(username, password, function(err, auth) {
            let res = false
            if (err) {
                console.log('ERROR: '+JSON.stringify(err));
                res = false;
            }
            if (auth) {
                console.log('Authenticated!');
                res = true
            }
            else {
                console.log('Authentication failed!');
                res = false
            }
            return callback(res)
            });
        } catch (err) {
            console.log(err)
            return callback(false)
        }    
    }

    getAllCorrespodences(callback) {
        try {
            var queryFindGroupsOptions = {
                scope: 'sub',
                filter: this.groupe
            }
            
            this.ad.findGroups(queryFindGroupsOptions, function(err, groups) {
                let res = []
                if (err) {
                console.log('ERROR: ' + err);
                }
            
                if ((! groups) || (groups.length == 0)) {
                console.log('No groups found.');
                } else {
                    for(let i=0; i<groups.length; i++) {
                    res.push({ value: groups[i].cn, label: groups[i].cn });
                    }
                }
                return callback(res)
            });
        } catch (err) {
            console.log(err)
            return callback([])
        }    
    }

    autentification(username, mdp, callback) {
          try {
            var username = username;
            var password = mdp;

            this.ad.authenticate(username, password, function(err, auth) {
            let res = false
            if (err) {
                console.log('ERROR: '+JSON.stringify(err));
                res = false;
            }
            if (auth) {
                console.log('Authenticated!');
                res = true
            }
            else {
                console.log('Authentication failed!');
                res = false
            }
            return callback(res)
            });

        } catch(err) {
            console.log(err)
            return callback(false)
        }
    }

    async getPermission(username, groupes, callback) {
        //Get username
        let usernameMemberOf;

        try{
            let words = username.split('@');
            usernameMemberOf = words[0];

        } catch (err) {
            console.log(err)
            return callback([])
        }

        //Get groups
        let res = []
        let memberPromisesArray =[]
        for(let i=0;i<groupes.length;i++) {

            let memberPromises = this.isMemberOfPromise(usernameMemberOf, groupes[i]).then((isMember)=>{
                if (isMember) {res.push(groupes[i])}
            }).catch((error)=> {console.log(error)})

            memberPromisesArray.push(memberPromises)
            
        }

        Promise.all(memberPromisesArray).then(()=>{
            callback(res)
        })
    }

    isMemberOfPromise(usernameMemberOf, groupe){
        return new Promise((resolve, reject) => {

            this.ad.isUserMemberOf(usernameMemberOf, groupe, function(err, isMember) {
                if (err) {
                    reject( 'ERROR: ' +JSON.stringify(err) )
                }
                resolve(isMember)
              })

        })
    }
}

module.exports = ADClient