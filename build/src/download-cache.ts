import fs from 'fs'
import crypto from 'crypto'
import { AsyncCache } from './async-cache'

const cacheDir = './build/cache'

const cache = new AsyncCache<string, Buffer>(write)

await fs.promises.mkdir(cacheDir, { recursive: true })
for (const path of await fs.promises.readdir(cacheDir)) {
    const tagHash = path.slice(0, -'.cache'.length)
    cache.set(tagHash, () => readFromDisk(tagHash), true)
}

async function readFromDisk(tagHash: string): Promise<Buffer> {
    return fs.promises.readFile(file(tagHash))
}

export async function get(tag: string, download: () => Promise<Buffer>): Promise<Buffer> {
    const tagHash = hash(tag)
    return cache.get(tagHash, download)
}

async function write(tagHash: string, data: Buffer) {
    await fs.promises.writeFile(file(tagHash), data)
}

function file(tagHash: string): string {
    return cacheDir + '/' + tagHash + '.cache'
}

function hash(tag: string): string {
    return crypto.createHash('sha256', { encoding: 'utf8' }).update(tag, 'utf8').digest('hex')
}
