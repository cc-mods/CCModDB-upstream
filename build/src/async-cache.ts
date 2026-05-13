export class AsyncCache<K extends PropertyKey, V> {
    private cache = new Map<K, () => Promise<V>>()

    constructor(private afterFetch?: (key: K, value: V) => Promise<void>) {}

    set(key: K, func: () => Promise<V>, wrapInSave?: boolean) {
        if (wrapInSave) {
            this.cache.set(key, () => {
                const ret = func()
                this.cache.set(key, () => ret)
                return ret
            })
        } else {
            this.cache.set(key, func)
        }
    }

    async get(key: K, fetchFunc: () => Promise<V>): Promise<V> {
        if (this.cache.has(key)) {
            // console.log('cache hit!', key)
            return this.cache.get(key)!()
        }
        // console.log('cache miss!', key)

        const downloadPromise = fetchFunc()
        this.set(key, () => downloadPromise)

        const data = await downloadPromise
        this.afterFetch?.(key, data)
        return data
    }
}
