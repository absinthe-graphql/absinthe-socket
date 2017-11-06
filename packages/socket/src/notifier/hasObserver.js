// @flow

import type {Notifier, Observer} from "../types";

const hasObserver = <Result>(
  notifier: Notifier<Result>,
  observer: Observer<Result>
) => notifier.observers.includes(observer);

export default hasObserver;
