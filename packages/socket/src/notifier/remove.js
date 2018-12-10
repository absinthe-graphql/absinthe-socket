// @flow

import {remove as arrayRemove} from "@jumpn/utils-array";

import findIndex from "./findIndex";

import type {Notifier} from "./types";

const remove = (notifier: Notifier<any, any>) => (
  notifiers: Array<Notifier<any, any>>
) =>
  arrayRemove(findIndex(notifiers, "request", notifier.request), 1, notifiers);

export default remove;
