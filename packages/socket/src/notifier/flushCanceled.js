// @flow

import notifyCanceled from "./notifyCanceled";
import {createCancelEvent} from "./event/eventCreators";

import type {Notifier} from "./types";

const clearCanceled = notifier => ({
  ...notifier,
  canceledObservers: []
});

const flushCanceled = <Result: any, Variables: void | Object>(
  notifier: Notifier<Result, Variables>
) =>
  notifier.canceledObservers.length > 0
    ? clearCanceled(notifyCanceled(notifier, createCancelEvent()))
    : notifier;

export default flushCanceled;
