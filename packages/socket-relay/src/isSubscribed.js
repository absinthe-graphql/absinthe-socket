// @flow

import {booleanize} from "@jumpn/utils-promise";

import type {Disposable} from "react-relay";

import subscriptions from "./subscriptions";

/**
 * Returns a promise that resolves to `true` in case subscription of given
 * disposable has started or to `false` otherwise
 */
const isSubscribed = (disposable: Disposable): Promise<boolean> => {
  const maybeSubscription = subscriptions.get(disposable);

  return maybeSubscription
    ? booleanize(maybeSubscription)
    : Promise.resolve(false);
};

export default isSubscribed;
