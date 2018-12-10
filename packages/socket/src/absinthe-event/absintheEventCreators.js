// @flow

import absintheEventNames from "./absintheEventNames";

import type {AbsintheDocEvent, AbsintheUnsubscribeEvent} from "./types";

const createAbsintheUnsubscribeEvent = (
  payload: $ElementType<AbsintheUnsubscribeEvent, "payload">
): AbsintheUnsubscribeEvent => ({
  payload,
  name: absintheEventNames.unsubscribe
});

const createAbsintheDocEvent = <Variables: void | Object>(
  payload: $ElementType<AbsintheDocEvent<Variables>, "payload">
): AbsintheDocEvent<Variables> => ({
  payload,
  name: absintheEventNames.doc
});

export {createAbsintheDocEvent, createAbsintheUnsubscribeEvent};
