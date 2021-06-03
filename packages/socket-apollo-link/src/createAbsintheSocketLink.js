// @flow

import {ApolloLink} from "@apollo/client/core";
import {send, toObservable, unobserveOrCancel} from "@absinthe/socket";
import {compose} from "flow-static-land/lib/Fun";
import {print} from "graphql";

import type {AbsintheSocket, GqlRequest, Observer} from "@absinthe/socket";
import type {DocumentNode} from "graphql/language/ast";

type ApolloOperation<Variables> = {|
  query: DocumentNode,
  variables: Variables
|};

const unobserveOrCancelIfNeeded = (absintheSocket, notifier, observer) => {
  if (notifier && observer) {
    unobserveOrCancel(absintheSocket, notifier, observer);
  }
};

const notifierToObservable = (absintheSocket, onError, onStart) => notifier =>
  toObservable(absintheSocket, notifier, {
    onError,
    onStart,
    unsubscribe: unobserveOrCancelIfNeeded
  });

const getRequest = <Variables: Object>({
  query,
  variables
}: ApolloOperation<Variables>): GqlRequest<Variables> => ({
  operation: print(query),
  variables
});

/**
 * Creates a terminating ApolloLink to request operations using given
 * AbsintheSocket instance
 */
const createAbsintheSocketLink = <Result, Variables: void | Object>(
  absintheSocket: AbsintheSocket,
  onError?: $ElementType<Observer<Result, Variables>, "onError">,
  onStart?: $ElementType<Observer<Result, Variables>, "onStart">
) =>
  new ApolloLink(
    compose(
      notifierToObservable(absintheSocket, onError, onStart),
      request => send(absintheSocket, request),
      getRequest
    )
  );

export default createAbsintheSocketLink;
