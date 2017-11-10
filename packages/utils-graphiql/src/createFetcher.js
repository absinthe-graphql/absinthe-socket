// @flow

import {getOperationType} from "@jumpn/utils-graphql";

import type {GqlRequestCompat} from "@jumpn/utils-graphql/compat/cjs/types";

import SubscriptionClient from "./SubscriptionsClient";

const parseIfJson = text => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
};

const responseToText = response => response.text();

const postJson = (url: string, body: Object): Promise<string> =>
  fetch(url, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    credentials: "include"
  })
    .then(responseToText)
    .then(parseIfJson);

const getSubscribeCallback = observer => (error, result) => {
  if (error) {
    observer.error(error);
  } else {
    observer.next(result);
  }
};

const subscribeWithObservable = (
  state,
  subscriptionsClient,
  subscriptionSentMessage,
  gqlRequestCompat
) => ({
  subscribe: (observer: {error: Function, next: Function}) => {
    observer.next(subscriptionSentMessage);

    state.activeSubscriptionId = subscriptionsClient.subscribe(
      gqlRequestCompat,
      getSubscribeCallback(observer)
    );
  }
});

/**
 * Creates a Fetcher using the given arguments
 */
const createFetcher = (
  apiUrl: string,
  subscriptionsClient: SubscriptionClient,
  subscriptionSentMessage: string
) => {
  const state = {activeSubscriptionId: undefined};

  return (gqlRequestCompat: GqlRequestCompat<any>) => {
    if (state.activeSubscriptionId) {
      subscriptionsClient.unsubscribe(state.activeSubscriptionId);
    }

    return getOperationType(gqlRequestCompat.query) !== "subscription"
      ? postJson(apiUrl, gqlRequestCompat)
      : subscribeWithObservable(
          state,
          subscriptionsClient,
          subscriptionSentMessage,
          gqlRequestCompat
        );
  };
};

export default createFetcher;
