import { _ } from 'meteor/erasaur:meteor-lodash';
import { RadGrad } from '../../api/radgrad/RadGrad';

// Publish all RadGrad collections.
_.forEach(RadGrad.collections, collection => collection.publish());
