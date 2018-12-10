// @flow

import {errorsToString as gqlErrorsToString} from "@jumpn/utils-graphql";

import type {GqlError} from "@jumpn/utils-graphql/compat/cjs/types";

import abortNotifier from "./abortNotifier";
import notifierFlushCanceled from "./notifier/flushCanceled";
import notifierNotifyCanceled from "./notifier/notifyCanceled";
import notifierNotifyStartEvent from "./notifier/notifyStartEvent";
import notifierRemove from "./notifier/remove";
import notifierReset from "./notifier/reset";
import pushAbsintheEvent from "./pushAbsintheEvent";
import pushRequestUsing, {onError} from "./pushRequestUsing";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import updateNotifiers from "./updateNotifiers";
import {createAbsintheUnsubscribeEvent} from "./absinthe-event/absintheEventCreators";
import {createErrorEvent} from "./notifier/event/eventCreators";

import type {AbsintheSocket, NotifierPushHandler} from "./types";
import type {Notifier} from "./notifier/types";

// TODO: improve this type
type UnsubscribeResponse = {};

type SubscriptionResponse =
  | {|subscriptionId: string|}
  | {|errors: Array<GqlError>|};

const onUnsubscribeSucceedCanceled = (absintheSocket, notifier) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifierFlushCanceled(notifier))
  );

const onUnsubscribeSucceedActive = (absintheSocket, notifier) =>
  subscribe(
    absintheSocket,
    refreshNotifier(
      absintheSocket,
      notifierReset(notifierFlushCanceled(notifier))
    )
  );

const createUnsubscribeError = message => new Error(`unsubscribe: ${message}`);

const unsubscribeHandler: NotifierPushHandler<UnsubscribeResponse> = {
  onError: (absintheSocket, notifier, errorMessage) =>
    abortNotifier(
      absintheSocket,
      notifier,
      createUnsubscribeError(errorMessage)
    ),

  onTimeout: (absintheSocket, notifier) =>
    notifierNotifyCanceled(
      notifier,
      createErrorEvent(createUnsubscribeError("timeout"))
    ),

  onSucceed: (absintheSocket, notifier) => {
    if (notifier.isActive) {
      onUnsubscribeSucceedActive(absintheSocket, notifier);
    } else {
      onUnsubscribeSucceedCanceled(absintheSocket, notifier);
    }
  }
};

const pushAbsintheUnsubscribeEvent = (
  absintheSocket,
  {request, subscriptionId}
) =>
  pushAbsintheEvent(
    absintheSocket,
    request,
    unsubscribeHandler,
    createAbsintheUnsubscribeEvent({subscriptionId})
  );

const unsubscribe = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>
) =>
  pushAbsintheUnsubscribeEvent(
    absintheSocket,
    refreshNotifier(absintheSocket, {
      ...notifier,
      requestStatus: requestStatuses.canceling
    })
  );

const onSubscribeCanceled = (absintheSocket, notifier) =>
  unsubscribe(absintheSocket, notifier);

const onSubscribeSucceed = (absintheSocket, notifier, {subscriptionId}) => {
  const updatedNotifier = refreshNotifier(absintheSocket, {
    ...notifier,
    subscriptionId,
    requestStatus: requestStatuses.sent
  });

  if (notifier.isActive) {
    notifierNotifyStartEvent(updatedNotifier);
  } else {
    onSubscribeCanceled(absintheSocket, updatedNotifier);
  }
};

const onSubscribeResponse = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  response: SubscriptionResponse
) => {
  if (response.errors) {
    onError(absintheSocket, notifier, gqlErrorsToString(response.errors));
  } else {
    onSubscribeSucceed(absintheSocket, notifier, response);
  }
};

const subscribe = <Result, Variables: void | Object>(
  absintheSocket: AbsintheSocket,
  notifier: Notifier<Result, Variables>
) => pushRequestUsing(absintheSocket, notifier, onSubscribeResponse);

export {subscribe, unsubscribe};
