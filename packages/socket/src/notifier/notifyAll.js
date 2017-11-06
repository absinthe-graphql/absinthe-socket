// @flow

import notify from "./notify";

import type {Event, Notifier} from "../types";

const notifyall = (notifiers: Array<Notifier<any>>, event: Event, data: any) =>
  notifiers.forEach(notifier => notify(notifier, event, data));

export default notifyall;
