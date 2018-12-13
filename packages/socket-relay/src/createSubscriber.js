// @flow

import notifierFind from "@absinthe/socket/dist/notifier/find";
import {observe, send, unobserveOrCancel} from "@absinthe/socket";
import {createDeferred} from "@jumpn/utils-promise";
import {getOperationType} from "@jumpn/utils-graphql";

import type {AbsintheSocket} from "@absinthe/socket";
import type {SubscribeFunction} from "react-relay";

import subscriptions from "./subscriptions";

const unobserveOrCancelIfNeeded = (absintheSocket, notifier, observer) => {
  if (notifier) {
    unobserveOrCancel(absintheSocket, notifier, observer);
  }
};

const createDisposable = (absintheSocket, {request}, observer) => ({
  dispose: () =>
    unobserveOrCancelIfNeeded(
      absintheSocket,
      notifierFind(absintheSocket.notifiers, "request", request),
      observer
    )
});

const onStart = deferred => notifier => deferred.resolve(notifier);

const onAbort = (deferred, callback) => error => {
  // callback is always defined but this is not correctly reflected in
  // SubscribeFunction
  callback && callback(error);

  deferred.reject(error);
};

/**
 * Creates a Subscriber (Relay SubscribeFunction) using the given AbsintheSocket
 * instance
 */
const createSubscriber = (
  absintheSocket: AbsintheSocket,
  onRecoverableError?: (error: Error) => any
): SubscribeFunction => (
  {text: operation},
  variables,
  cacheConfig,
  {onError: OnUnrecoverableError, onNext}
) => {
  // we need to place this logic here and not in ensureIsSubscription as if we
  // do so, then flow is not able to infer we are validating operation
  if (!operation || getOperationType(operation) !== "subscription") {
    throw new Error(
      `Expected subscription, but instead got:\n${(operation: any)}`
    );
  }

  const notifier = send(absintheSocket, {operation, variables});

  const deferred = createDeferred();

  const observer = {
    onAbort: onAbort(deferred, OnUnrecoverableError),
    onError: onRecoverableError,
    onResult: (onNext: any),
    onStart: onStart(deferred)
  };

  observe(absintheSocket, notifier, observer);

  const disposable = createDisposable(absintheSocket, notifier, observer);

  subscriptions.set(disposable, deferred.promise);

  return disposable;
};

export default createSubscriber;
