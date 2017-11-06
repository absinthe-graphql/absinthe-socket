// @flow

import type {AbsintheSocket, Notifier} from "./types";

type Notifiers = Array<Notifier<any>>;

const updateNotifiers = (
  absintheSocket: AbsintheSocket,
  updater: (notifiers: Notifiers) => Notifiers
) => {
  absintheSocket.notifiers = updater(absintheSocket.notifiers);

  return absintheSocket;
};

export default updateNotifiers;
