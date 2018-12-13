// @flow

import notifyActive from "./notifyActive";
import {createStartEvent} from "./event/eventCreators";

import type {Notifier} from "./types";

const notifyStartEvent = <Result, Variables: void | Object>(
  notifier: Notifier<Result, Variables>
) => notifyActive(notifier, createStartEvent(notifier));

export default notifyStartEvent;
