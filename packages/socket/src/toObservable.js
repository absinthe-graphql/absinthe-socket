// @flow

import Observable from "zen-observable";

import observe from "./observe";

import type {AbsintheSocket} from "./types";
import type {Notifier, Observer} from "./notifier/types";

type Options<Result, Variables: void | Object> = {
  onError: $ElementType<Observer<Result, Variables>, "onError">,
  onStart: $ElementType<Observer<Result, Variables>, "onStart">,
  unsubscribe: (observer: Observer<Result, Variables>) => void
};

const onResult = (notifier, observableObserver) => result => {
  observableObserver.next(result);

  if (notifier.operationType !== "subscription") {
    observableObserver.complete();
  }
};

/**
 * Creates an Observable that will follow the given notifier
 *
 * @param {AbsintheSocket} absintheSocket
 * @param {Notifier<Result, Variables>} notifier
 * @param {Object} [options]
 * @param {function(error: Error): undefined} [options.onError]
 * @param {function(notifier: Notifier<Result, Variables>): undefined} [options.onStart]
 * @param {function(): undefined} [options.unsubscribe]
 *
 * @return {Observable}
 */
const toObservable = <Result, Variables: void | Object>(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<Result, Variables>,
  {onError, onStart, unsubscribe}: $Shape<Options<Result, Variables>> = {}
) =>
  new Observable(observableObserver => {
    const observer = observe(absintheSocket, notifier, {
      onError,
      onStart,
      onAbort: observableObserver.error.bind(observableObserver),
      onResult: onResult(notifier, observableObserver)
    });

    return unsubscribe && (() => unsubscribe(observer));
  });

export default toObservable;
