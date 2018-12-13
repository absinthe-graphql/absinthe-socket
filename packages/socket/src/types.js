// @flow

import {Channel, Socket as PhoenixSocket} from "phoenix";

import type {Notifier, Observer} from "./notifier/types";

type AbsintheSocket = {|
  channel: Channel,
  channelJoinCreated: boolean,
  notifiers: Array<Notifier<any>>,
  phoenixSocket: PhoenixSocket
|};

type PushHandler<Response: Object> = {|
  onError: (errorMessage: string) => any,
  onSucceed: (response: Response) => any,
  onTimeout: () => any
|};

type NotifierPushHandler<Response: Object> = {|
  onError: (
    absintheSocket: AbsintheSocket,
    notifier: Notifier<any, any>,
    errorMessage: string
  ) => any,
  onSucceed: (
    absintheSocket: AbsintheSocket,
    notifier: Notifier<any, any>,
    response: Response
  ) => any,
  onTimeout: (
    absintheSocket: AbsintheSocket,
    notifier: Notifier<any, any>
  ) => any
|};

export type {AbsintheSocket, NotifierPushHandler, Observer, PushHandler};
