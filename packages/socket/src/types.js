// @flow

import {Channel, Socket as PhoenixSocket} from "phoenix";

import type {
  GqlOperationType,
  GqlRequest,
  GqlResponse
} from "@jumpn/utils-graphql/compat/cjs/types";

type Event = "Abort" | "Cancel" | "Error" | "Start" | "Result";

type Observer<Result> = {
  onAbort?: (error: Error) => any,
  onCancel?: () => any,
  onError?: (error: Error) => any,
  onStart?: (notifier: Notifier<Result>) => any,
  onResult?: (result: Result) => any
};

type Notifier<Result> = {
  observers: Array<Observer<Result>>,
  operationType: GqlOperationType,
  request: GqlRequest<*>,
  subscriptionId?: string
};

type AbsintheSocket = {
  channel: Channel,
  channelJoinCreated: boolean,
  notifiers: Array<Notifier<any>>,
  phoenixSocket: PhoenixSocket
};

type SubscriptionPayload<Data> = {
  result: GqlResponse<Data>,
  subscriptionId: string
};

type PushHandler<Response: Object> = {
  onError: (errorMessage: string) => any,
  onSucceed: (response: Response) => any,
  onTimeout: () => any
};

type NotifierPushHandler<Response: Object> = {
  onError: (
    absintheSocket: AbsintheSocket,
    notifier: Notifier<any>,
    errorMessage: string
  ) => any,
  onSucceed: (
    absintheSocket: AbsintheSocket,
    notifier: Notifier<any>,
    response: Response
  ) => any,
  onTimeout: (absintheSocket: AbsintheSocket, notifier: Notifier<any>) => any
};

export type {
  AbsintheSocket,
  Event,
  GqlOperationType,
  GqlRequest,
  GqlResponse,
  Notifier,
  NotifierPushHandler,
  Observer,
  PushHandler,
  SubscriptionPayload
};
