// @flow

import notifierObserve from "./notifier/observe";
import notifierRefresh from "./notifier/refresh";
import updateNotifiers from "./updateNotifiers";

import type {AbsintheSocket, Notifier, Observer} from "./types";

/**
 * Observes given notifier using the provided observer
 *
 * @example
 * import AbsintheSocket from "@absinthe/socket"
 *
 * const logEvent = eventName => (...args) => console.log(eventName, ...args);
 *
 * const updatedNotifier = AbsintheSocket.observe(absintheSocket, notifier, {
 *   onAbort: logEvent("abort"),
 *   onError: logEvent("error"),
 *   onStart: logEvent("open"),
 *   onResult: logEvent("result")
 * });
 */
const observe = <Result>(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<Result>,
  observer: Observer<Result>
): AbsintheSocket =>
  updateNotifiers(
    absintheSocket,
    notifierRefresh(notifierObserve(notifier, observer))
  );

export default observe;
