const Webdav = require('webdav')
const fs = require('fs')
const path = require('path')

async function sendOverWebdav(job, done) {
    let endpoint = job.data.endpoint
    let file = job.data.file

    try {
        //Creating the connection
        const client = Webdav.createClient(endpoint.url,
            {
                username: endpoint.username,
                password: endpoint.password,
                digest: endpoint.digest || false
            })
        await client.stat("./"); // Canary in a coal mine (will throw while createWriteStream wont)
        //Transfering archive
        let rs = fs.createReadStream(file.path, {autoClose: true})
        await new Promise((resolve, reject) => {
            //Monitoring the progress
            let sent = 0
            rs.on('data', (chunk) => {
                sent += chunk.length
                job.progress(sent / file.size * 100).catch((err => console.error(err)))

            })
            rs.on('end', () => {
                resolve()
            })
            rs.on('error', reject)
            try {
                let ws = client.createWriteStream(path.join(endpoint.targetFolder, file.name))
                rs.pipe(ws)
            } catch (error) {
                console.error(error)
            }
        })
    } catch (error) {
        console.error(error)
        done(error)
    }
    job.progress(100)
    done()
}

module.exports = {sendOverWebdav}