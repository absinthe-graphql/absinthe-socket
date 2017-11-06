// @flow

import type {Disposable} from "react-relay";
import type {Notifier} from "@jumpn/absinthe-phoenix-socket/compat/cjs/types";

const subscriptions: WeakMap<
  Disposable,
  Promise<Notifier<any>>
> = new WeakMap();

export default subscriptions;
