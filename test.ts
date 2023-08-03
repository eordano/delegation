import { promises as fs } from 'fs'
import { loadData } from './src/loadData'

;(async function() {
    const data = await fs.readFile('./static/data/all.json', 'utf-8')
    const parsed = await loadData(JSON.parse(data) as any)
    console.log(parsed.members['0x9147dc23a24073b7a4210173383b90e6437c507e'])
})().catch(console.error)