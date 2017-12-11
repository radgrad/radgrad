// import { _ } from 'meteor/erasaur:meteor-lodash';

/**
 * BaseFilter is an abstract superclass of all RadGrad filters.
 * @memberOf api/filter
 */
class BaseFilter {

  /**
   * Superclass constructor for all RadGrad filters.
   * @param name {String} the name of the filter.
   */
  constructor(name, ) {
    this._filterName = name;
  }
}

/**
 * The BaseFilter used by all RadGrad filters.
 */
export default BaseFilter;
