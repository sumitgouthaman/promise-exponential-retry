Promise exponential retry
=========================

Just a simple utility to retry promises with exponential backoff.

### Usage
Import NPM package:  

```
npm i --save promise-exponential-retry
```

Import RetryPromise in your source:  

```typescript
import { RetryPromise } from 'promise-exponential-retry';
```

Wrap your promises using retryPromise():  

```typescript
return RetryPromise.retryPromise('getArrivalDepartures', () => {
  // Return your actual promise here:
  return new Promise<YourReturnType>((resolve, reject) => {
    ... // Your code
  });
});
```

The retryPromise() takes following arguments:  
- `requestId`: String that will be used in logging related to this promise.  
- `promiseLambda`: A lambda that returns the promise you want to wrap.  
- `maxRetries`: Maximum number of retries.  
- `initialDelay`: How many millis to delay first retry.  
- `maxDelay`: Maximum delay between retries.  
- `delayJitter`: Jitter in millis to add to the delays.  
  Eg. If delayJitter = x, then delay could be random value between `delay-x`
  to `delay+x`.  
