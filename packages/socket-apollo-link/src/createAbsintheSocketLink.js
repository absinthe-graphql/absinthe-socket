// @flow

import {ApolloLink} from "apollo-link";
import {cancel, send, observe} from "@absinthe/socket";
import {compose} from "flow-static-land/lib/Fun";
import {print} from "graphql/language/printer";
import Observable from "zen-observable";

import type {
  AbsintheSocket,
  GqlRequest,
  Observer
} from "@absinthe/socket/compat/cjs/types";
import type {DocumentNode} from "graphql/language/ast";
import type {Subscriber} from "zen-observable";

type ApolloOperation<Variables> = {
  query: DocumentNode,
  variables: Variables
};

const getRequest = <Variables: Object>({
  query,
  variables
}: ApolloOperation<Variables>): GqlRequest<Variables> => ({
  operation: print(query),
  variables
});

const onResult = (notifier, subscriber: Subscriber<any>) => result => {
  subscriber.next(result);

  if (notifier.operationType !== "subscription") {
    subscriber.complete();
  }
};

const notifierToObservable = (absintheSocket, onError, onStart) => notifier => {
  let notifierStarted;
  let unsubscribed = false;
  const observer: Observer<any> = {
    onError,
    onStart: notifierLatest => {
      notifierStarted = notifierLatest;

      if (unsubscribed) {
        cancel(absintheSocket, notifierStarted, observer);
      }

      onStart && onStart(notifierLatest);
    }
  };

  const unsubscribe = () => {
    unsubscribed = true;
    if (notifierStarted) {
      cancel(absintheSocket, notifierStarted, observer);
    }
  };

  return new Observable(subscriber => {
    observer.onAbort = subscriber.error;
    observer.onResult = onResult(notifier, subscriber);
    observe(absintheSocket, notifier, observer);

    return unsubscribe;
  });
};

/**
 * Creates a terminating ApolloLink to request operations using given
 * AbsintheSocket instance
 */
const createAbsintheSocketLink = (
  absintheSocket: AbsintheSocket,
  onError?: $PropertyType<Observer<*>, "onError">,
  onStart?: $PropertyType<Observer<*>, "onStart">
) =>
  new ApolloLink(
    compose(
      notifierToObservable(absintheSocket, onError, onStart),
      request => send(absintheSocket, request),
      getRequest
    )
  );

export default createAbsintheSocketLink;
