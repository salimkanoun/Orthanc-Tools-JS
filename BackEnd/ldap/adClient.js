var ActiveDirectory = require('activedirectory');

class ADClient {
    
    constructor(type, protocole,  adresse, port, DN, mdp, base, user, groupe) {
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
    }

    async testSettings(callback) {
        let ad;
        
        try {
            var config = { url: this.protocole + this.adresse + ':' + this.port,
            baseDN: this.base,
            username: this.DN,
            password: this.mdp 
            }

            ad = new ActiveDirectory(config);
        } catch(err) {
            console.log(err)
            return callback(false)
        }

        try {
            var username = this.DN;
            var password = this.mdp;

            await ad.authenticate(username, password, function(err, auth) {
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

    async getAllCorrespodences(callback) {
        let ad;
        
        try {
            var config = { url: this.protocole + this.adresse + ':' + this.port,
            baseDN: this.base,
            username: this.DN,
            password: this.mdp 
            }
        
            ad = new ActiveDirectory(config);
        } catch(err) {
            console.log(err)
            return callback([])
        }

        try {
            var queryFindGroupsOptions = {
                scope: 'sub',
                filter: this.groupe
            }
            
            await ad.findGroups(queryFindGroupsOptions, function(err, groups) {
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

    async autentification(username, mdp, callback) {
        let ad;
        
        try {
            var config = { url: this.protocole + this.adresse + ':' + this.port,
            baseDN: this.base,
            username: this.DN,
            password: this.mdp 
            }

            ad = new ActiveDirectory(config);
        } catch(err) {
            console.log(err)
            return callback(false)
        }

        try {
            var username = username;
            var password = mdp;

            await ad.authenticate(username, password, function(err, auth) {
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

    async getPermition(username, callback) {
        try{
            return callback(true)
        } catch(err) {
            console.log(err)
        }
    }
    
}

module.exports = ADClient