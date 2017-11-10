// @flow

import {Socket as PhoenixSocket} from "phoenix";

import type {Message} from "phoenix";

import joinChannel from "./joinChannel";
import notifierFind from "./notifier/find";
import notifierNotify from "./notifier/notify";
import notifierRemove from "./notifier/remove";
import updateNotifiers from "./updateNotifiers";

import type {AbsintheSocket, SubscriptionPayload} from "./types";

const createConnectionCloseError = () => new Error("connection: close");

const mutationOnConnectionClose = (absintheSocket, notifier) => {
  updateNotifiers(absintheSocket, notifierRemove(notifier));

  notifierNotify(notifier, "Abort", createConnectionCloseError());
};

const notifierOnConnectionClose = absintheSocket => notifier => {
  if (notifier.operationType === "mutation") {
    mutationOnConnectionClose(absintheSocket, notifier);
  } else {
    notifierNotify(notifier, "Error", createConnectionCloseError());
  }
};

const onConnectionClose = absintheSocket => () =>
  absintheSocket.notifiers.forEach(notifierOnConnectionClose(absintheSocket));

const onSubscriptionData = (
  absintheSocket: AbsintheSocket,
  {payload}: Message<SubscriptionPayload<any>>
) => {
  const notifier = notifierFind(
    absintheSocket.notifiers,
    "subscriptionId",
    payload.subscriptionId
  );

  if (notifier) {
    notifierNotify(notifier, "Result", payload.result);
  }
};

const onMessage = absintheSocket => (response: Message<>) => {
  if (response.event === "subscription:data") {
    onSubscriptionData(absintheSocket, response);
  }
};

const shouldJoinChannel = absintheSocket =>
  !absintheSocket.channelJoinCreated && absintheSocket.notifiers.length > 0;

const onConnectionOpen = absintheSocket => () => {
  if (shouldJoinChannel(absintheSocket)) {
    joinChannel(absintheSocket);
  }
};

const absintheChannelName = "__absinthe__:control";

/**
 * Creates an Absinthe Socket using the given Phoenix Socket instance
 *
 * @example
 * import * as AbsintheSocket from "@absinthe/socket";
 * import {Socket as PhoenixSocket} from "phoenix";

 * const absintheSocket = AbsintheSocket.create(
 *   new PhoenixSocket("ws://localhost:4000/socket")
 * );
 */
const create = (phoenixSocket: PhoenixSocket): AbsintheSocket => {
  const absintheSocket: AbsintheSocket = {
    phoenixSocket,
    channel: phoenixSocket.channel(absintheChannelName),
    channelJoinCreated: false,
    notifiers: []
  };

  phoenixSocket.onOpen(onConnectionOpen(absintheSocket));
  phoenixSocket.onMessage(onMessage(absintheSocket));
  phoenixSocket.onClose(onConnectionClose(absintheSocket));

  return absintheSocket;
};

export default create;
