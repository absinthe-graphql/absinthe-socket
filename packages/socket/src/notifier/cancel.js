// @flow

import type {Notifier} from "./types";

const cancel = <Result, Variables: void | Object>({
  activeObservers,
  canceledObservers,
  ...rest
}: Notifier<Result, Variables>) => ({
  ...rest,
  isActive: false,
  activeObservers: [],
  canceledObservers: [...activeObservers, ...canceledObservers]
});

export default cancel;
