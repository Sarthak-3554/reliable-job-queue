export function getRetryDelay(attempts) {
    return Math.pow(2, attempts) * 5000;
}