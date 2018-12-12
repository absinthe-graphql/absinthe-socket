// @flow

const requestStatuses = {
  canceled: ("canceled": "canceled"),
  canceling: ("canceling": "canceling"),
  pending: ("pending": "pending"),
  sent: ("sent": "sent"),
  sending: ("sending": "sending")
};

type RequestStatus = $Values<typeof requestStatuses>;

export default requestStatuses;

export type {RequestStatus};
