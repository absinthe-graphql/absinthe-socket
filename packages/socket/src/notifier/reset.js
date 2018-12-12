// @flow

import flushCanceled from "./flushCanceled";
import requestStatuses from "./requestStatuses";

import type {Notifier} from "./types";

const reset = <Result, Variables: void | Object>(
  notifier: Notifier<Result, Variables>
) =>
  flushCanceled({
    ...notifier,
    isActive: true,
    requestStatus: requestStatuses.pending,
    subscriptionId: undefined
  });

export default reset;
