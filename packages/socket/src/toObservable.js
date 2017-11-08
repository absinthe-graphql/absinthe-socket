// @flow

import Observable from "zen-observable";

import observe from "./observe";

import type {AbsintheSocket, Notifier, Observer} from "./types";

type Options<Result> = {
  unsubscribe: () => void,
  onError: $PropertyType<Observer<Result>, "onError">,
  onStart: $PropertyType<Observer<Result>, "onStart">
};

const onResult = (notifier, observer) => result => {
  observer.next(result);

  if (notifier.operationType !== "subscription") {
    observer.complete();
  }
};

/**
 * Creates an Observable that will follow the given notifier
 *
 * @param {AbsintheSocket} absintheSocket
 * @param {Notifier<Result>} notifier
 * @param {Object} [options]
 * @param {function(error: Error): undefined} [options.onError]
 * @param {function(notifier: Notifier<Result>): undefined} [options.onStart]
 * @param {function(): undefined} [options.unsubscribe]
 *
 * @return {Observable}
 */
const toObservable = <Result>(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<Result>,
  {onError, onStart, unsubscribe}: $Shape<Options<Result>> = {}
) =>
  new Observable(observer => {
    observe(absintheSocket, notifier, {
      onError,
      onStart,
      onAbort: observer.error,
      onResult: onResult(notifier, observer)
    });

    return unsubscribe;
  });

export default toObservable;
