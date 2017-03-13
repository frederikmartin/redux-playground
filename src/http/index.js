const ASYNC_AWAIT_TIME = 1000;

export const httpPut = (url, callback) => {
    setTimeout(() => {
        callback();
    }, ASYNC_AWAIT_TIME);
};
