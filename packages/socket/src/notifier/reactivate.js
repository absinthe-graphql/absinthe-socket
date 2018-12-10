// @flow

import type {Notifier} from "./types";

const reactivate = <Result, Variables: void | Object>(
  notifier: Notifier<Result, Variables>
) => (notifier.isActive ? notifier : {...notifier, isActive: true});

export default reactivate;
