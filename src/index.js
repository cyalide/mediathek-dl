import '@babel/polyfill'
import request from 'request-promise'
import fs from 'fs'
import http from 'http'
import https from 'https'
import dayjs from 'dayjs'
const configLocation =
    process.env.CONF ||
    (fs.existsSync('../config.json') && '../config.json') ||
    (fs.existsSync('config.json') && 'config.json')
const archiveLocation =
    process.env.ARCHIVE ||
    (fs.existsSync('../archive.json') && '../archive.json') ||
    (fs.existsSync('archive.json') && 'archive.json') ||
    (fs.writeFile('archive.json', '', {}, () => '_') && 'archive.json')

const options = {
    method: 'POST',
    uri: 'https://mediathekviewweb.de/api/query',
    headers: {
        'content-type': 'text/plain',
    },
    json: true,
}

function callWith(queries) {
    const body = {
        queries,
        sortBy: 'timestamp',
        sortOrder: 'asc',
        future: false,
        offset: 0,
        size: 10000,
    }
    return request(Object.assign({}, options, { body }))
}

function download(response, file) {
    const stream = fs.createWriteStream(file)
    response.pipe(stream)
    stream.on('finish', () => stream.close())
}

// Get queries
try {
    var config = JSON.parse(fs.readFileSync(configLocation))
    var queries = config.queries,
        dlDirectory = process.env.DLDIR || config.dl || 'dl'
} catch (e) {
    if (e) throw e
}

if (!fs.existsSync(dlDirectory)) fs.mkdirSync(dlDirectory)

try {
    var archiveRaw = fs.readFileSync(archiveLocation)
    if (archiveRaw.length) {
        var archive = JSON.parse(archive.raw)
    } else {
        var archive = []
    }
} catch (e) {
    if (e) throw e
}

;(async () => {
    const response = await callWith(queries)
    const results = response.result.results
    results.forEach(result => {
        if (
            (config.timestamp &&
                !dayjs(result.timestamp).isAfter(config.timestamp)) ||
            rchive[0] &&
                !dayjs(result.timestamp).isAfter(archive[0].timestamp))
        )
            return
        if (
            archive.length &&
            !archive.map(el => {
                if (
                    el.description === result.description ||
                    el.description.includes(result.description) ||
                    el.description.includes(result.description)
                )
                    return true
            }).length
        )
            return

        const file = `${dlDirectory}/${dayjs.unix(result.timestamp).format(
            'YYMM'
        )}_${result.channel}_${result.title}.mp4`
        const url = new URL(
            result.url_video_hd || result.url_video || result.url_video_low
        )
        if (url.protocol === 'https:') {
            https.get(url, response => download(response, file)).on('error', e => console.error(e))
        } else if (url.protocol === 'http:') {
            http.get(url, response => download(response, file)).on('error', e => console.error(e))
        } else {
            throw new Error('Invalid protocol: ' + url.protocol)
        }
        archive.unshift(result)
    })
})()
