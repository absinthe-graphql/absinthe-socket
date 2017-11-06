// @flow

import {Push} from "phoenix";

import type {PushHandler} from "./types";

const handlePush = (push: Push, handler: PushHandler<any>) =>
  push
    .receive("ok", handler.onSucceed)
    .receive("error", handler.onError)
    .receive("timeout", handler.onTimeout);

export default handlePush;
