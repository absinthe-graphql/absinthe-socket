// @flow

import {errorsToString as gqlErrorsToString} from "@jumpn/utils-graphql";

import type {
  GqlError,
  GqlResponse
} from "@jumpn/utils-graphql/compat/cjs/types";

import createPushHandler from "./createPushHandler";
import handlePush from "./handlePush";
import notifierNotify from "./notifier/notify";
import notifierRemove from "./notifier/remove";
import notifierRefresh from "./notifier/refresh";
import updateNotifiers from "./updateNotifiers";

import type {AbsintheSocket, Notifier, NotifierPushHandler} from "./types";

type SubscriptionResponse =
  | {|subscriptionId: string|}
  | {|errors: Array<GqlError>|};

const notifyStart = notifier => notifierNotify(notifier, "Start", notifier);

const onSubscriptionSucceed = (absintheSocket, notifier, {subscriptionId}) => {
  updateNotifiers(
    absintheSocket,
    notifierRefresh({...notifier, subscriptionId})
  );

  notifyStart(notifier);
};

const abortRequest = (absintheSocket, notifier, error) => {
  updateNotifiers(absintheSocket, notifierRemove(notifier));

  notifierNotify(notifier, "Abort", error);
};

const onError = (absintheSocket, notifier, errorMessage) =>
  abortRequest(absintheSocket, notifier, new Error(errorMessage));

const onSubscriptionResponse = (absintheSocket, notifier, response) => {
  if (response.errors) {
    onError(absintheSocket, notifier, gqlErrorsToString(response.errors));
  } else {
    onSubscriptionSucceed(absintheSocket, notifier, response);
  }
};

const onQueryOrMutationResponse = (absintheSocket, notifier, response) => {
  updateNotifiers(absintheSocket, notifierRemove(notifier));

  notifierNotify(notifier, "Result", response);
};

const onTimeout = (absintheSocket, notifier) =>
  notifierNotify(notifier, "Error", new Error("request: timeout"));

const queryOrMutationHandler: NotifierPushHandler<GqlResponse<any>> = {
  onError,
  onTimeout,
  onSucceed: onQueryOrMutationResponse
};

const subcriptionHandler: NotifierPushHandler<SubscriptionResponse> = {
  onError,
  onTimeout,
  onSucceed: onSubscriptionResponse
};

const requestToDoc = ({operation, variables}) =>
  variables ? {query: operation, variables} : {query: operation};

const send = (absintheSocket, request, notifierPushHandler) =>
  handlePush(
    absintheSocket.channel.push("doc", requestToDoc(request)),
    createPushHandler(notifierPushHandler, absintheSocket, request)
  );

const pushRequest = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any>
) => {
  if (notifier.operationType === "subscription") {
    send(absintheSocket, notifier.request, subcriptionHandler);
  } else {
    notifyStart(notifier);
    send(absintheSocket, notifier.request, queryOrMutationHandler);
  }
};

export default pushRequest;
