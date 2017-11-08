declare module "phoenix" {
  declare export type Message<Payload = any> = {
    topic: string,
    event: string,
    payload: Payload,
    ref: null | number,
    join_ref: null | number
  };

  declare type SocketOpts = {
    decode: (json: string, callback: (data: Object) => any) => any,
    encode: (data: Object, callback: (json: string) => any) => any,
    heartbeatIntervalMs: number,
    logger: (kind: string, msg: string, data: Object) => any,
    longpollerTimeout: number,
    params: number,
    reconnectAfterMs: number,
    timeout: number,
    transport: string
  };

  // This is not implemented in flow <= 0.55.0
  declare class CloseEvent extends Event {
    reason: string,
    wasClean: boolean
  }

  declare export class Socket {
    constructor(endPoint: string, opts?: $Shape<SocketOpts>): Socket,
    protocol(): string,
    endPointURL(): string,
    disconnect(callback: () => any, code: number, reason: string): void,
    connect(params?: Object): void,
    isConnected(): boolean,
    log(kind: string, msg: string, data: Object): void,
    onOpen(callback: () => any): void,
    onClose(callback: (event: CloseEvent) => any): void,
    onError(callback: (error: Event) => any): void,
    onMessage(callback: (event: Message<>) => any): void,
    channel(topic: string, params?: Object): Channel,
    remove(channel: Channel): void,
    push(data: mixed): void,
    makeRef(): string
  }

  declare export class Push {
    constructor(
      channel: Channel,
      event: string,
      payload?: mixed,
      timeout: number
    ): Push,
    resend(timeout: number): void,
    send(): void,
    receive(status, callback: (response: any) => any): Push
  }

  declare export class Channel {
    constructor(topic: string, params: Object, socket: Socket): Channel,
    join(timeout?: number): Push,
    on(event: string, callback: Function): number,
    off(event: string, ref: number): void,
    onClose(callback: Function): void,
    onError(callback: (reason: string) => any): number,
    onMessage(string: event, payload: mixed, ref: number): mixed,
    push(event: string, payload: mixed): Push,
    leave(timeout: number): Push
  }
}
