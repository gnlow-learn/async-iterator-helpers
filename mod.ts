export class AsyncIterator<T> implements AsyncIterable<T> {
    constructor(private iterable: AsyncIterable<T>) {}

    [Symbol.asyncIterator]() {
        return this.iterable[Symbol.asyncIterator]()
    }

    map<U>(transformer: (value: T) => U | Promise<U>): AsyncIterator<U> {
        const original = this.iterable
        return new AsyncIterator((async function* () {
            for await (const item of original) {
                yield await transformer(item)
            }
        })())
    }

    take(limit: number): AsyncIterator<T> {
        const original = this.iterable
        return new AsyncIterator((async function* () {
            let count = 0
            if (limit <= 0) return
            for await (const item of original) {
                yield item
                if (++count >= limit) break
            }
        })())
    }

    filter(predicate: (value: T) => boolean | Promise<boolean>): AsyncIterator<T> {
        const original = this.iterable
        return new AsyncIterator((async function* () {
            for await (const item of original) {
                if (await predicate(item)) yield item
            }
        })())
    }

    async forEach(action: (value: T) => void | Promise<void>): Promise<void> {
        for await (const item of this.iterable) {
            await action(item)
        }
    }

    async toArray(): Promise<T[]> {
        const result: T[] = []
        for await (const item of this.iterable) {
            result.push(item)
        }
        return result
    }

    static from<U>(iterable: AsyncIterable<U> | Iterable<U>): AsyncIterator<U> {
        if (Symbol.asyncIterator in iterable) {
            return new AsyncIterator(iterable as AsyncIterable<U>)
        }
        return new AsyncIterator((async function* () {
            for (const item of iterable as Iterable<U>) yield item
        })())
    }
}
