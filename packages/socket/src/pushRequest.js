// @flow

import type {GqlResponse} from "@jumpn/utils-graphql/compat/cjs/types";

import notifierNotifyActive from "./notifier/notifyActive";
import notifierNotifyStartEvent from "./notifier/notifyStartEvent";
import notifierRemove from "./notifier/remove";
import pushRequestUsing from "./pushRequestUsing";
import updateNotifiers from "./updateNotifiers";
import {createResultEvent} from "./notifier/event/eventCreators";
import {subscribe} from "./subscription";

import type {AbsintheSocket} from "./types";
import type {Notifier} from "./notifier/types";

const onQueryOrMutationSucceed = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>,
  response: GqlResponse<any>
) =>
  updateNotifiers(
    absintheSocket,
    notifierRemove(notifierNotifyActive(notifier, createResultEvent(response)))
  );

const pushQueryOrMutation = (absintheSocket, notifier) =>
  pushRequestUsing(
    absintheSocket,
    notifierNotifyStartEvent(notifier),
    onQueryOrMutationSucceed
  );

const pushRequest = (
  absintheSocket: AbsintheSocket,
  notifier: Notifier<any, any>
) => {
  if (notifier.operationType === "subscription") {
    subscribe(absintheSocket, notifier);
  } else {
    pushQueryOrMutation(absintheSocket, notifier);
  }
};

export default pushRequest;
