// @flow

import createPushHandler from "./createPushHandler";
import handlePush from "./handlePush";
import notifierNotify from "./notifier/notify";
import notifierRefresh from "./notifier/refresh";
import notifierRemove from "./notifier/remove";
import notifierUnobserve from "./notifier/unobserve";
import updateNotifiers from "./updateNotifiers";

import type {AbsintheSocket, Notifier, Observer, NotifierPushHandler} from "./types";

// TODO: improve this type
type UnsubscribeResponse = {};

const removeNotifiers = (absintheSocket, notifier) => {
  updateNotifiers(absintheSocket, notifierRemove(notifier));

  notifierNotify(notifier, "Cancel", notifier);
};

const onError = (absintheSocket, notifier, errorMessage) => {
  // eslint-disable-next-line no-use-before-define
  unsubscribe(absintheSocket, notifier);

  notifierNotify(notifier, "Error", `unsubscribe: ${errorMessage}`);
};

const onTimeout = (absintheSocket, notifier) =>
  notifierNotify(notifier, "Error", "unsubscribe: timeout");

const notifierPushHandler: NotifierPushHandler<UnsubscribeResponse> = {
  onError,
  onTimeout,
  onSucceed: removeNotifiers
};

const unsubscribe = (absintheSocket, notifier) =>
  handlePush(
    absintheSocket.channel.push("unsubscribe", {
      subscriptionId: notifier.subscriptionId
    }),
    createPushHandler(notifierPushHandler, absintheSocket, notifier.request)
  );

/**
 * Cancels a notifier sending a Cancel event to all its observers and
 * unsubscribing in case it holds a subscription request
 *
 * @example
 * import * as AbsintheSocket from "@absinthe/socket";
 *
 * AbsintheSocket.cancel(absintheSocket, notifier);
 */
const cancel = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any>,
  observer: Observer<any>
): AbsintheSocket => {
  observer.onCancel && observer.onCancel();

  notifier = notifierUnobserve(notifier, observer);
  if (notifier.observers.length === 0) {
    // this was the last observer -> remove the whole notifier and
    // unsubscribe the subscription if necessary.
    removeNotifiers(absintheSocket, notifier);
    if (notifier.operationType === "subscription") {
      unsubscribe(absintheSocket, notifier);
    }
  }
  else {
    // there are other observers left -> only refresh the list
    // with the updated notifier.
    updateNotifiers(absintheSocket, notifierRefresh(notifier));
  }

  return absintheSocket;
};

export default cancel;
