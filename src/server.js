import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express()

app.use(express.json({limit: '2mb'}))


let itemid = 0
const items = []

app.get('/api/lost', (req, res) => {
    res.json(items.map(item => {
        return {
            itemid: item.itemid,
            nodeid: item.nodeid
        }
    }))
})

app.get('/api/lost/:itemid', (req, res) => {
    const {itemid} = req.params
    const item = items.find((item) => item.itemid == itemid)

    res.json(item)
})

app.post('/api/found', (req, res) => {
    const nodeid = req.body.nodeid
    const imageData = req.body.imageData
    const guardName = req.body.guardName

    items.push({
        itemid: itemid++,
        nodeid,
        imageData,
        guardName
    })

    res.json({ itemid: itemid - 1 })
})
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.resolve(__dirname, '..', 'dist')))



app.get('/*splat', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'))
})

app.listen(process.env.PORT || 8000)