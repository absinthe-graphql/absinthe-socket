// @flow

import requestStatuses from "./requestStatuses";

import type {Notifier} from "./types";

const reset = <Result, Variables: void | Object>(
  notifier: Notifier<Result, Variables>
) => ({
  ...notifier,
  isActive: true,
  requestStatus: requestStatuses.pending,
  subscriptionId: undefined
});

export default reset;
