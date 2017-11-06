// @flow

import {map} from "@jumpn/utils-composite";

import type {GqlRequest} from "@jumpn/utils-graphql/compat/cjs/types";

import notifierFind from "./notifier/find";

import type {AbsintheSocket, NotifierPushHandler, PushHandler} from "./types";

const createEventHandler = (absintheSocket, request) => handle => (...args) => {
  const notifier = notifierFind(absintheSocket.notifiers, "request", request);

  if (notifier) {
    handle(absintheSocket, notifier, ...args);
  }
};

const createPushHandler = <Response: Object>(
  notifierPushHandler: NotifierPushHandler<Response>,
  absintheSocket: AbsintheSocket,
  request: GqlRequest<any>
): PushHandler<Response> =>
  map(createEventHandler(absintheSocket, request), notifierPushHandler);

export default createPushHandler;
