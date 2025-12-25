import { AsyncIterator } from "./mod.ts"

async function* createAsyncNumbers(max: number, delay: number = 100) {
    for (let i = 1; i <= max; i++) {
        await new Promise(resolve => setTimeout(resolve, delay))
        yield i
    }
}


AsyncIterator.from(createAsyncNumbers(5, 500))
    .forEach(x => console.log(x))
