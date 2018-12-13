// @flow

import handlePush from "./handlePush";
import notifierNotifyActive from "./notifier/notifyActive";
import pushRequest from "./pushRequest";
import {createErrorEvent} from "./notifier/event/eventCreators";

import type {AbsintheSocket} from "./types";

const createChannelJoinError = message => new Error(`channel join: ${message}`);

const notifyErrorToAllActive = (absintheSocket, errorMessage) =>
  absintheSocket.notifiers.forEach(notifier =>
    notifierNotifyActive(
      notifier,
      createErrorEvent(createChannelJoinError(errorMessage))
    )
  );

// join Push is reused and so the handler
// https://github.com/phoenixframework/phoenix/blob/master/assets/js/phoenix.js#L356
const createChannelJoinHandler = absintheSocket => ({
  onError: (errorMessage: string) =>
    notifyErrorToAllActive(absintheSocket, errorMessage),

  onSucceed: () =>
    absintheSocket.notifiers.forEach(notifier =>
      pushRequest(absintheSocket, notifier)
    ),

  onTimeout: () => notifyErrorToAllActive(absintheSocket, "timeout")
});

const joinChannel = (absintheSocket: AbsintheSocket) => {
  handlePush(
    absintheSocket.channel.join(),
    createChannelJoinHandler(absintheSocket)
  );

  absintheSocket.channelJoinCreated = true;

  return absintheSocket;
};

export default joinChannel;
