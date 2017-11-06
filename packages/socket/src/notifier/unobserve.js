// @flow

import {remove as arrayRemove} from "@jumpn/utils-array";

import type {Notifier, Observer} from "../types";

const unobserve = <Result>(
  {observers, ...rest}: Notifier<Result>,
  observer: Observer<Result>
) => ({
  ...rest,
  observers: arrayRemove(observers.indexOf(observer), 1, observers)
});

export default unobserve;
