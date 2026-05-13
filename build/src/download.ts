import https from 'https'
import http from 'http'
import stream from 'stream'
import * as downloadCache from './download-cache'
import { AsyncCache } from './async-cache'

type FollowReturn = { head: http.IncomingMessage; realUrl: string }
const followCache = new AsyncCache<string, FollowReturn>()

/**
 *
 * @param url
 * @returns path to file
 */
export async function download(url: string): Promise<Buffer> {
    const { head, realUrl } = await followCached(url)
    const etag = getTag(head)

    return downloadCache.get(etag, () => actualDownload(realUrl))
}
async function actualDownload(url: string) {
    const resp = await body(url)
    return streamToBuffer(resp.pipe(new stream.PassThrough()))
}

export function streamToBuffer(readable: stream.Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const parts: Buffer[] = []
        readable
            .on('data', d => parts.push(d))
            .on('end', () => resolve(Buffer.concat(parts)))
            .on('error', err => reject(err))
    })
}

async function followCached(url: string): Promise<FollowReturn> {
    return followCache.get(url, () => follow(url))
}

async function follow(url: string): Promise<FollowReturn> {
    let result = await head(url)
    while (result.statusCode === 302 || result.statusCode === 301) {
        url = result.headers.location!
        result.destroy()
        result = await head(url)
    }
    result.destroy()
    return { head: result, realUrl: url }
}

function head(url: string): Promise<http.IncomingMessage> {
    return getUsingMethod(url, 'HEAD')
}

function body(url: string): Promise<http.IncomingMessage> {
    return getUsingMethod(url, 'GET')
}

async function getUsingMethod(url: string, method: string): Promise<http.IncomingMessage> {
    const parsedUrl = new URL(url)
    const client = parsedUrl.protocol === 'https:' ? https : http

    const options: http.RequestOptions = {
        method,
    }

    return new Promise((resolve, reject) => {
        client.get(parsedUrl, options, resolve).on('error', reject)
    })
}

function getTag(head: http.IncomingMessage): string {
    switch (typeof head.headers.etag) {
        case 'string':
            return head.headers.etag
        case 'object':
            return head.headers.etag[0]
        default:
            return ''
    }
}
