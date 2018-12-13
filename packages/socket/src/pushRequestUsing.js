// @flow

import {requestToCompat} from "@jumpn/utils-graphql";

import abortNotifier from "./abortNotifier";
import notifierNotifyActive from "./notifier/notifyActive";
import pushAbsintheEvent from "./pushAbsintheEvent";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import {createAbsintheDocEvent} from "./absinthe-event/absintheEventCreators";
import {createErrorEvent} from "./notifier/event/eventCreators";

import type {AbsintheSocket, NotifierPushHandler} from "./types";
import type {Notifier} from "./notifier/types";

const pushAbsintheDocEvent = (absintheSocket, {request}, notifierPushHandler) =>
  pushAbsintheEvent(
    absintheSocket,
    request,
    notifierPushHandler,
    createAbsintheDocEvent(requestToCompat(request))
  );

const setNotifierRequestStatusSending = (absintheSocket, notifier) =>
  refreshNotifier(absintheSocket, {
    ...notifier,
    requestStatus: requestStatuses.sending
  });

const createRequestError = message => new Error(`request: ${message}`);

const onTimeout = (absintheSocket, notifier) =>
  notifierNotifyActive(
    notifier,
    createErrorEvent(createRequestError("timeout"))
  );

const onError = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  errorMessage: string
) => abortNotifier(absintheSocket, notifier, createRequestError(errorMessage));

const getNotifierPushHandler = onSucceed => ({onError, onSucceed, onTimeout});

const pushRequestUsing = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  onSucceed: $ElementType<NotifierPushHandler<any>, "onSucceed">
) =>
  pushAbsintheDocEvent(
    absintheSocket,
    setNotifierRequestStatusSending(absintheSocket, notifier),
    getNotifierPushHandler(onSucceed)
  );

export {pushRequestUsing as default, onError};
