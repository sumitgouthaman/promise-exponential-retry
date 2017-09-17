export class RetryPromise {

  private static getJitteredDelay(delay: number, jitter: number): number {
    const appliedJitter = Math.floor(Math.random() * (jitter * 2 + 1)) - jitter;
    return delay - appliedJitter;
  }

  private static retryPromiseInner<T>(requestId: string, promiseLambda: () => Promise<T>,
    resolve: (T) => void, reject: (any) => void,
    maxRetries, initialDelay: number, maxDelay: number, delayJitter: number,
    attemptNum) {

    if (attemptNum > maxRetries) {
      reject(`Request ${requestId} failed after ${attemptNum} attempts.`);
      return;
    }
    console.log(`Attempt ${attemptNum}/${maxRetries} of request ${requestId}`);

    let delay = 0;
    if (attemptNum !== 0) {
      delay = initialDelay * Math.pow(2, attemptNum - 1);
      delay = Math.min(delay, maxDelay);
      delay = RetryPromise.getJitteredDelay(delay, delayJitter);
      delay = Math.max(0, delay);
    }

    console.log(`Attempt ${attemptNum}/${maxRetries} of request ${requestId} will use delay: ${delay}`);

    setTimeout(() => {
      promiseLambda().then((result: T) => {
        resolve(result);
      }).catch(error => {
        RetryPromise.retryPromiseInner(
          requestId, promiseLambda, resolve, reject,
          maxRetries, initialDelay, maxDelay, delayJitter,
          attemptNum + 1);
      });
    }, delay);
  }

  static retryPromise<T>(requestId: string, promiseLambda: () => Promise<T>,
    maxRetries: number = 3, initialDelay: number = 200, maxDelay: number = 2000,
    delayJitter: number = 25):
    Promise<T> {
    return new Promise<T>((resolve, reject) => {
        RetryPromise.retryPromiseInner(requestId, promiseLambda,
        resolve, reject,
        maxRetries, initialDelay, maxDelay, delayJitter, 0);
    });
  }
}