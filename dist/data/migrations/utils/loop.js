export async function loop(batchFn, chunkSize = 100) {
    let turn = 0;
    let last = chunkSize;
    while (last === chunkSize) {
        last = await batchFn(chunkSize * turn, chunkSize);
        turn++;
    }
}
//# sourceMappingURL=loop.js.map