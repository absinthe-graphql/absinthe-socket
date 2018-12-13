// @flow

import type {Event, Observer} from "../types";

const getNotifier = (handlerName, payload) => observer =>
  observer[handlerName] && observer[handlerName](payload);

const getHandlerName = ({name}) => `on${name}`;

const notifyAll = <Result, Variables: void | Object>(
  observers: $ReadOnlyArray<Observer<Result, Variables>>,
  event: Event
) => observers.forEach(getNotifier(getHandlerName(event), event.payload));

export default notifyAll;
