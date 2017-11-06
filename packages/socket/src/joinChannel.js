// @flow

import handlePush from "./handlePush";
import notifierNotifyAll from "./notifier/notifyAll";
import pushRequest from "./pushRequest";

import type {AbsintheSocket} from "./types";

// join Push is reused and so the handler
// https://github.com/phoenixframework/phoenix/blob/master/assets/js/phoenix.js#L356
const createChannelJoinHandler = absintheSocket => ({
  onError: (errorMessage: string) =>
    notifierNotifyAll(
      absintheSocket.notifiers,
      "Error",
      new Error(`channel join: ${errorMessage}`)
    ),

  onSucceed: () =>
    absintheSocket.notifiers.forEach(notifier =>
      pushRequest(absintheSocket, notifier)
    ),

  onTimeout: () =>
    notifierNotifyAll(
      absintheSocket.notifiers,
      "Error",
      new Error("channel join: timeout")
    )
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
