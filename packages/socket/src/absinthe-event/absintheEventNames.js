// @flow

const absintheEventNames = {
  doc: ("doc": "doc"),
  unsubscribe: ("unsubscribe": "unsubscribe")
};

type AbsintheEventName = $Values<typeof absintheEventNames>;

export default absintheEventNames;

export type {AbsintheEventName};
