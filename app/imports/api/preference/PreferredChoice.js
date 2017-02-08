import { _ } from 'meteor/erasaur:meteor-lodash';

/** @module Preferences */

class PreferredChoice {

  /**
   * Creates a new PreferredChoice instance given the array of choices and array of interestIDs.
   * @param choices
   * @param interestIDs
   */
  constructor(choices, interestIDs) {
    this._rankedChoices = {};
    let max = 0;
    _.map(choices, (choice) => {
      const score = _.intersection(choice.interestIDs, interestIDs).length;
      if (score > max) {
        max = score;
      }
      if (!this._rankedChoices[score]) {
        this._rankedChoices[score] = [];
      }
      this._rankedChoices[score].push(choice);
    });
    this.max = max;
  }

  /**
   * Returns an array of the choices that best match the interestIDs.
   * @returns {*} an array of the choices that best match the interests.
   */
  getBestChoices() {
    return this._rankedChoices[this.max];
  }
}

export { PreferredChoice as default };
