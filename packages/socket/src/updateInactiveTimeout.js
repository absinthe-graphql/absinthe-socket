// @flow

import type {AbsintheSocket} from "./types";

const closeConnection = (absintheSocket: AbsintheSocket) => {
  absintheSocket.channel.leave();
  absintheSocket.phoenixSocket.disconnect();
  absintheSocket.channelJoinCreated = false;
  absintheSocket.channel = absintheSocket.phoenixSocket.channel(
    absintheSocket.absintheChannelName
  );
  return absintheSocket;
};

const startInactivityTimeout = (absintheSocket: AbsintheSocket) => {
  if (
    !absintheSocket.inactivityTimeout &&
    absintheSocket.inactivityTimeoutDuration
  ) {
    absintheSocket.inactivityTimeout = setTimeout(
      () => closeConnection(absintheSocket),
      absintheSocket.inactivityTimeoutDuration
    );
  }
  return absintheSocket;
};

const cancelInactivityTimeout = (absintheSocket: AbsintheSocket) => {
  if (absintheSocket.inactivityTimeout) {
    clearTimeout(absintheSocket.inactivityTimeout);
    absintheSocket.inactivityTimeout = null;
  }
  return absintheSocket;
};

const updateInactivityTimeout = (absintheSocket: AbsintheSocket) => {
  if (absintheSocket.notifiers.length === 0) {
    return startInactivityTimeout(absintheSocket);
  }
  return cancelInactivityTimeout(absintheSocket);
};

export default updateInactivityTimeout;
