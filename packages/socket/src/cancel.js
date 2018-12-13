// @flow

import notifierCancel from "./notifier/cancel";
import notifierFlushCanceled from "./notifier/flushCanceled";
import notifierRefresh from "./notifier/refresh";
import notifierRemove from "./notifier/remove";
import refreshNotifier from "./refreshNotifier";
import requestStatuses from "./notifier/requestStatuses";
import updateNotifiers from "./updateNotifiers";
import {unsubscribe} from "./subscription";

import type {AbsintheSocket} from "./types";
import type {Notifier} from "./notifier/types";

const cancelQueryOrMutationSending = (absintheSocket, notifier) =>
  updateNotifiers(
    absintheSocket,
    notifierRefresh(notifierFlushCanceled(notifierCancel(notifier)))
  );

const cancelQueryOrMutationIfSending = (absintheSocket, notifier) =>
  notifier.requestStatus === requestStatuses.sending
    ? cancelQueryOrMutationSending(absintheSocket, notifier)
    : absintheSocket;

const cancelPending = (absintheSocket, notifier) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifierFlushCanceled(notifierCancel(notifier)))
  );

const cancelQueryOrMutation = (absintheSocket, notifier) =>
  notifier.requestStatus === requestStatuses.pending
    ? cancelPending(absintheSocket, notifier)
    : cancelQueryOrMutationIfSending(absintheSocket, notifier);

const unsubscribeIfNeeded = (absintheSocket, notifier) =>
  notifier.requestStatus === requestStatuses.sent
    ? unsubscribe(absintheSocket, notifier)
    : absintheSocket;

const cancelNonPendingSubscription = (absintheSocket, notifier) =>
  unsubscribeIfNeeded(
    absintheSocket,
    refreshNotifier(absintheSocket, notifierCancel(notifier))
  );

const cancelSubscription = (absintheSocket, notifier) =>
  notifier.requestStatus === requestStatuses.pending
    ? cancelPending(absintheSocket, notifier)
    : cancelNonPendingSubscription(absintheSocket, notifier);

const cancelActive = (absintheSocket, notifier) =>
  notifier.operationType === "subscription"
    ? cancelSubscription(absintheSocket, notifier)
    : cancelQueryOrMutation(absintheSocket, notifier);

/**
 * Cancels a notifier sending a Cancel event to all its observers and
 * unsubscribing in case it holds a subscription request
 *
 * @example
 * import * as withAbsintheSocket from "@absinthe/socket";
 *
 * withAbsintheSocket.cancel(absintheSocket, notifier);
 */
const cancel = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>
): AbsintheSocket =>
  notifier.isActive ? cancelActive(absintheSocket, notifier) : absintheSocket;

export default cancel;
