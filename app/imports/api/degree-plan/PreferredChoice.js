import { _ } from 'meteor/erasaur:meteor-lodash';

/**
 * Class that can calculate the preferred choice given an array of interests.
 * @memberOf api/degree-plan
 */
class PreferredChoice {

  /**
   * Creates a new PreferredChoice instance given the array of choices and array of interestIDs.
   * @param choices
   * @param interestIDs
   */
  constructor(choices, interestIDs) {
    this._rankedChoices = {};
    let max = 0;
    _.forEach(choices, (choice) => {
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

  /**
   * Returns an array with the best matches first.
   * @returns {Array}
   */
  getOrderedChoices() {
    let choices = [];
    for (let i = this.max; i >= 0; i--) {
      if (this._rankedChoices[i]) {
        choices = choices.concat(this._rankedChoices[i]);
      }
    }
    // console.log(choices);
    return choices;
  }
  /**
   * Returns true if there are any preferences.
   * @return {boolean} true if max !== 0.
   */
  hasPreferences() {
    return this.max !== 0;
  }
}

export { PreferredChoice as default };
