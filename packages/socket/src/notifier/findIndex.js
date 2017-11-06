// @flow

import {hasIn} from "@jumpn/utils-composite";

import type {Notifier} from "../types";

const findIndex = (notifiers: Array<Notifier<any>>, key: string, value: any) =>
  // $FlowFixMe: flow is having some troubles to match hasIn signature (curry)
  notifiers.findIndex(hasIn([key], value));

export default findIndex;
