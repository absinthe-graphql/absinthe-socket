// @flow

import createPushHandler from "./createPushHandler";
import handlePush from "./handlePush";
import notifierNotify from "./notifier/notify";
import notifierRemove from "./notifier/remove";
import updateNotifiers from "./updateNotifiers";

import type {AbsintheSocket, Notifier, NotifierPushHandler} from "./types";

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
  notifier: Notifier<any>
): AbsintheSocket => {
  if (notifier.operationType === "subscription") {
    unsubscribe(absintheSocket, notifier);
  } else {
    removeNotifiers(absintheSocket, notifier);
  }

  return absintheSocket;
};

export default cancel;
