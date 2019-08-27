import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import * as FormUtils from '../form-fields/form-field-utilities';
import { getRouteUserName } from '../shared/route-user-name';
import { VerificationRequests } from '../../../api/verification/VerificationRequestCollection';
import { defineMethod, updateMethod } from '../../../api/base/BaseCollection.methods';
import { Slugs } from '../../../api/slug/SlugCollection';
import { OpportunityInstances } from '../../../api/opportunity/OpportunityInstanceCollection';
import { userInteractionDefineMethod } from '../../../api/analytic/UserInteractionCollection.methods';

const verificationSchema = new SimpleSchema({
  documentation: String,
}, { tracker: Tracker });

Template.Request_Verification_Form.onCreated(function requestVerificationFormOnCreated() {
  this.instance = this.data.instance;
  FormUtils.setupFormWidget(this, verificationSchema);
});

Template.Request_Verification_Form.helpers({
  // add your helpers here
});

Template.Request_Verification_Form.events({
  submit(event) {
    event.preventDefault();
    const data = FormUtils.getSchemaDataFromEvent(verificationSchema, event);
    const id = Template.instance().instance._id;
    const request = VerificationRequests.findNonRetired({ opportunityInstanceID: id });
    const collectionName = VerificationRequests.getCollectionName();
    if (request.length === 0) {
      const definitionData = {
        student: getRouteUserName(),
        opportunityInstance: id,
        documentation: data.documentation,
      };
      console.log(collectionName, definitionData);
      defineMethod.call({ collectionName, definitionData }, (error) => {
        if (error) {
          console.error('Failed to create verification request', error);
        }
      });
    } else {
      const documentation = `${request[0].documentation}\n${data.documentation}`;
      const status = VerificationRequests.OPEN;
      const updateData = {};
      updateData.id = request[0]._id;
      updateData.documentation = documentation;
      updateData.status = status;
      updateMethod.call({ collectionName, updateData }, (error) => {
        if (error) {
          console.error('Failed updating verification request', error);
        }
      });
    }
    const typeData = Slugs.getNameFromID(OpportunityInstances.getOpportunityDoc(id).slugID);
    const interactionData = { username: getRouteUserName(), type: 'verifyRequest', typeData };
    userInteractionDefineMethod.call(interactionData, (err) => {
      if (err) {
        console.log('Error creating UserInteraction', err);
      }
    });
  },
});

Template.Request_Verification_Form.onRendered(function requestVerificationFormOnRendered() {
  // add your statement here
});

Template.Request_Verification_Form.onDestroyed(function requestVerificationFormOnDestroyed() {
  // add your statement here
});

