// @flow

import {Socket as PhoenixSocket} from "phoenix";

import type {Message} from "phoenix";

import abortNotifier from "./abortNotifier";
import joinChannel from "./joinChannel";
import notifierFind from "./notifier/find";
import notifierNotify from "./notifier/notify";
import notifierNotifyActive from "./notifier/notifyActive";
import {
  createErrorEvent,
  createResultEvent
} from "./notifier/event/eventCreators";

import type {AbsintheSocket, SubscriptionPayload} from "./types";

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
    notifierNotifyActive(notifier, createResultEvent(payload.result));
  }
};

const subscriptionDataEventName = "subscription:data";

const onMessage = absintheSocket => (response: Message<>) => {
  if (response.event === subscriptionDataEventName) {
    onSubscriptionData(absintheSocket, response);
  }
};

const createConnectionCloseError = () => new Error("connection: close");

const shouldAbortNotifier = notifier =>
  !notifier.isActive || notifier.operationType === "mutation";

const notifierOnConnectionClose = absintheSocket => notifier => {
  if (shouldAbortNotifier(notifier)) {
    abortNotifier(absintheSocket, notifier, createConnectionCloseError());
  } else {
    notifierNotify(notifier, createErrorEvent(createConnectionCloseError()));
  }
};

const onConnectionClose = absintheSocket => () =>
  absintheSocket.notifiers.forEach(notifierOnConnectionClose(absintheSocket));

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
  phoenixSocket.onClose(onConnectionClose(absintheSocket));
  phoenixSocket.onMessage(onMessage(absintheSocket));

  return absintheSocket;
};

export default create;
