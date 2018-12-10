// @flow

import type {GqlRequestCompat} from "@jumpn/utils-graphql/compat/cjs/types";

import absintheEventNames from "./absintheEventNames";

import type {AbsintheEventName} from "./absintheEventNames";

type AbsintheEventWith<Name: AbsintheEventName, Payload> = {|
  name: Name,
  payload: Payload
|};

type AbsintheUnsubscribeEvent = AbsintheEventWith<
  typeof absintheEventNames.unsubscribe,
  {
    subscriptionId: string
  }
>;

type AbsintheDocEvent<Variables: void | Object> = AbsintheEventWith<
  typeof absintheEventNames.doc,
  GqlRequestCompat<Variables>
>;

type AbsintheEvent = AbsintheDocEvent<any> | AbsintheUnsubscribeEvent;

export type {AbsintheEvent, AbsintheDocEvent, AbsintheUnsubscribeEvent};
