import onHeaders from 'on-headers';
export const serverTimingAndCache = (req, res, next) => {
    req.res = res;
    const now = process.hrtime();
    onHeaders(res, () => {
        const delta = process.hrtime(now);
        const costInMilliseconds = (delta[0] + delta[1] / 1e9) * 1000;
        const serverTiming = res.getHeader('Server-Timing');
        const serverTimingValue = `${serverTiming ? `${serverTiming}, ` : ''}total;dur=${costInMilliseconds}`;
        res.setHeader('Server-Timing', serverTimingValue);
    });
    next();
};
//# sourceMappingURL=timing.js.map