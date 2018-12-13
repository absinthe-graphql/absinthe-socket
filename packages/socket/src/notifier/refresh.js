// @flow

import {replace as arrayReplace} from "@jumpn/utils-array";

import findIndex from "./findIndex";

import type {Notifier} from "./types";

const refresh = (notifier: Notifier<any, any>) => (
  notifiers: Array<Notifier<any, any>>
) =>
  arrayReplace(
    findIndex(notifiers, "request", notifier.request),
    [notifier],
    notifiers
  );

export default refresh;
