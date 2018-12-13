// @flow

import observerNotifyAll from "./observer/notifyAll";

import type {Event, Notifier} from "./types";

const getObservers = ({activeObservers, canceledObservers}) => [
  ...activeObservers,
  ...canceledObservers
];

const notify = <Result, Variables: void | Object>(
  notifier: Notifier<Result, Variables>,
  event: Event
) => {
  observerNotifyAll(getObservers(notifier), event);

  return notifier;
};

export default notify;
