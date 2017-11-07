// @flow

import notifierRefresh from "./notifier/refresh";
import notifierUnobserve from "./notifier/unobserve";
import updateNotifiers from "./updateNotifiers";

import type {AbsintheSocket, Notifier, Observer} from "./types";

/**
 * Detaches observer from notifier
 *
 * @example
 * import * as AbsintheSocket from "@absinthe/socket";
 *
 * AbsintheSocket.unobserve(absintheSocket, notifier, observer);
 */
const unobserve = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any>,
  observer: Observer<any>
): AbsintheSocket => {
  updateNotifiers(
    absintheSocket,
    notifierRefresh(notifierUnobserve(notifier, observer))
  );

  return absintheSocket;
};

export default unobserve;
