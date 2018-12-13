// @flow

import notifierNotify from "./notifier/notify";
import notifierRemove from "./notifier/remove";
import updateNotifiers from "./updateNotifiers";
import {createAbortEvent} from "./notifier/event/eventCreators";

import type {AbsintheSocket} from "./types";
import type {Notifier} from "./notifier/types";

const abortNotifier = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  error: Error
) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifierNotify(notifier, createAbortEvent(error)))
  );

export default abortNotifier;
