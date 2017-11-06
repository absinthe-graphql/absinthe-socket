// @flow

import {getOperationType} from "@jumpn/utils-graphql";

import type {GqlRequest, Notifier} from "../types";

const create = (request: GqlRequest<any>): Notifier<*> => ({
  request,
  observers: [],
  operationType: getOperationType(request.operation),
  subscriptionId: undefined
});

export default create;
