// @flow

import {cancel, observe, send} from "@jumpn/absinthe-phoenix-socket";
import {createDeferred} from "@jumpn/utils-promise";
import {getOperationType} from "@jumpn/utils-graphql";

import type {AbsintheSocket} from "@jumpn/absinthe-phoenix-socket/compat/cjs/types";
import type {SubscribeFunction} from "react-relay";

import subscriptions from "./subscriptions";

const onStart = deferred => notifier => deferred.resolve(notifier);

const onAbort = (deferred, callback) => error => {
  // callback is always defined but this is not correctly reflected in
  // SubscribeFunction
  callback && callback(error);

  deferred.reject(error);
};

const createDisposable = (absintheSocket, notifier) => ({
  dispose: () => {
    cancel(absintheSocket, notifier);
  }
});

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

  const disposable = createDisposable(absintheSocket, notifier);

  const deferred = createDeferred();

  subscriptions.set(disposable, deferred.promise);

  observe(absintheSocket, notifier, {
    onAbort: onAbort(deferred, OnUnrecoverableError),
    onError: onRecoverableError,
    onStart: onStart(deferred),
    onValue: (onNext: any)
  });

  return disposable;
};

export default createSubscriber;
