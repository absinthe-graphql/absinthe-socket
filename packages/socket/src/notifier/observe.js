// @flow

import type {Notifier, Observer} from "../types";

const observe = <Result>(
  {observers, ...rest}: Notifier<Result>,
  observer: Observer<Result>
) => ({
  ...rest,
  observers: [...observers, observer]
});

export default observe;
