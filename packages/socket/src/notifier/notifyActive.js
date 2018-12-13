// @flow

import observerNotifyAll from "./observer/notifyAll";

import type {Event, Notifier} from "./types";

const notifyActive = <Result, Variables: void | Object>(
  notifier: Notifier<Result, Variables>,
  event: Event
) => {
  observerNotifyAll(notifier.activeObservers, event);

  return notifier;
};

export default notifyActive;
