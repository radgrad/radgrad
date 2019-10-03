import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/erasaur:meteor-lodash';

export function getGroupName() {
  return _.get(FlowRouter.current(), 'route.group.name', '');
}
