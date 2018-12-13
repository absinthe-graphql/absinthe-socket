// @flow

const eventNames = {
  abort: ("Abort": "Abort"),
  cancel: ("Cancel": "Cancel"),
  error: ("Error": "Error"),
  result: ("Result": "Result"),
  start: ("Start": "Start")
};

type EventName = $Values<typeof eventNames>;

export default eventNames;

export type {EventName};
