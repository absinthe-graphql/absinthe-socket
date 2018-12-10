// @flow

import eventNames from "./eventNames";

import type {
  AbortEvent,
  CancelEvent,
  ErrorEvent,
  Notifier,
  ResultEvent,
  StartEvent
} from "../types";

const createStartEvent = <Payload: Notifier<any, any>>(
  payload: Payload
): StartEvent<Payload> => ({payload, name: eventNames.start});

const createResultEvent = <Result>(payload: Result): ResultEvent<Result> => ({
  payload,
  name: eventNames.result
});

const createErrorEvent = (payload: Error): ErrorEvent => ({
  payload,
  name: eventNames.error
});

const createCancelEvent = (): CancelEvent => ({
  name: eventNames.cancel,
  payload: undefined
});

const createAbortEvent = (payload: Error): AbortEvent => ({
  payload,
  name: eventNames.abort
});

export {
  createStartEvent,
  createResultEvent,
  createErrorEvent,
  createCancelEvent,
  createAbortEvent
};
