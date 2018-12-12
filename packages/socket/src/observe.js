// @flow

import notifierObserve from "./notifier/observe";
import refreshNotifier from "./refreshNotifier";

import type {AbsintheSocket} from "./types";
import type {Notifier, Observer} from "./notifier/types";

/**
 * Observes given notifier using the provided observer
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket"
 *
 * const logEvent = eventName => (...args) => console.log(eventName, ...args);
 *
 * const updatedNotifier = withAbsintheSocket.observe(absintheSocket, notifier, {
 *   onAbort: logEvent("abort"),
 *   onError: logEvent("error"),
 *   onStart: logEvent("open"),
 *   onResult: logEvent("result")
 * });
 */
const observe = <Result, Variables: void | Object>(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<Result, Variables>,
  observer: Observer<Result, Variables>
) => refreshNotifier(absintheSocket, notifierObserve(notifier, observer));

export default observe;
