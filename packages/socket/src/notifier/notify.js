// @flow

import type {Event, Notifier} from "../types";

const getNotifier = (handlerName, data) => observer =>
  observer[handlerName] && observer[handlerName](data);

const getHandlerName = event => `on${event}`;

const notify = (notifier: Notifier<any>, event: Event, data: any) =>
  notifier.observers.forEach(getNotifier(getHandlerName(event), data));

export default notify;
