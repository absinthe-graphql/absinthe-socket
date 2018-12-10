// @flow

import type {Notifier} from "./types";

const getCanceledObservers = ({activeObservers, canceledObservers}) =>
  canceledObservers.length
    ? [...activeObservers, ...canceledObservers]
    : activeObservers;

const cancelObservers = notifier => ({
  ...notifier,
  activeObservers: [],
  canceledObservers: getCanceledObservers(notifier)
});

const cancelObserversIfNeeded = notifier =>
  notifier.activeObservers.length > 0 ? cancelObservers(notifier) : notifier;

const deactivate = notifier => ({...notifier, isActive: false});

const cancel = <Result, Variables: void | Object>(
  notifier: Notifier<Result, Variables>
) =>
  notifier.isActive ? cancelObserversIfNeeded(deactivate(notifier)) : notifier;

export default cancel;
