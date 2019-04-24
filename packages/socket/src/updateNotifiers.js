// @flow
import updateInactiveTimeout from "./updateInactiveTimeout";

import type {AbsintheSocket} from "./types";
import type {Notifier} from "./notifier/types";

type Notifiers = Array<Notifier<any, any>>;

const updateNotifiers = (
  absintheSocket: AbsintheSocket,
  updater: (notifiers: Notifiers) => Notifiers
) => {
  absintheSocket.notifiers = updater(absintheSocket.notifiers);

  return updateInactiveTimeout(absintheSocket);
};

export default updateNotifiers;
