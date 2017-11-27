// @flow

import {ApolloLink} from "apollo-link";
import {cancel, send, toObservable} from "@absinthe/socket";
import {compose} from "flow-static-land/lib/Fun";
import {print} from "graphql/language/printer";

import type {
  AbsintheSocket,
  GqlRequest,
  Observer
} from "@absinthe/socket/compat/cjs/types";
import type {DocumentNode} from "graphql/language/ast";

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

const notifierToObservable = (absintheSocket, onError, onStart) => notifier => {
  let notifierStarted;
  let unsubscribed = false;

  return toObservable(absintheSocket, notifier, {
    onError,
    onStart: notifierLatest => {
      notifierStarted = notifierLatest;

      if (unsubscribed) {
        cancel(absintheSocket, notifierStarted);
      }

      onStart && onStart(notifierLatest);
    },
    unsubscribe: () => {
      unsubscribed = true;

      if (notifierStarted) {
        cancel(absintheSocket, notifierStarted);
      }
    }
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
