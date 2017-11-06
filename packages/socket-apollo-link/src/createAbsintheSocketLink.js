// @flow

import {ApolloLink} from "apollo-link";
import {cancel, send, toObservable} from "@jumpn/absinthe-phoenix-socket";
import {compose} from "flow-static-land/lib/Fun";
import {print} from "graphql/language/printer";

import type {
  AbsintheSocket,
  GqlRequest,
  Observer
} from "@jumpn/absinthe-phoenix-socket/compat/cjs/types";
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

const notifierToObservable = (absintheSocket, onError, onStart) => notifier =>
  toObservable(absintheSocket, notifier, {
    onError,
    onStart,
    unsubscribe: () => {
      cancel(absintheSocket, notifier);
    }
  });

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
