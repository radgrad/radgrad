/* global window */
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Spacebars } from 'meteor/spacebars';
import { HTML } from 'meteor/htmljs';
import { $ } from 'meteor/jquery';
import { moment } from 'meteor/momentjs:moment';
import { Logger } from 'meteor/jag:pince';

const logger = new Logger('cache');

const viewMap = window.viewMap = {};
// const HTML = HTML;

Template.cacher = new Template('Template.cacher', function () {
  const wrapperView = this;
  const templateName = Spacebars.call(wrapperView.lookup('template'));
  const id = Spacebars.call(wrapperView.lookup('id'));
  const data = Spacebars.call(wrapperView.lookup('data')) || {};

  if (!templateName) {
    throw new Error('Template name is required');
  }

  const baseView = Blaze._TemplateWith({}, function () {
    return HTML.Raw('<div></div>'); // eslint-disable-line
  });

  let view = viewMap[id];
  if (!view) {
    view = Blaze._TemplateWith(data, function () {
      return Spacebars.include(Template[templateName]);
    });
    viewMap[id] = view;
    view.dom = $('<div></div>');
    Blaze.render(view, view.dom.get(0));
    view._superView = true;
    view._domrange._superRange = true;
  }

  baseView.onViewReady(function () {
    // here's we mark this node to destroy innter elements
    // we need to override Blaze._destroyNode to overcome this
    this.firstNode()._ignoreElements = true;

    // now we need to append our original node here
    $(this.firstNode()).append(view.dom);
  });

  return baseView;
});

const originalDestroyNode = Blaze._destroyNode;
Blaze._destroyNode = function (elem) {
  // We don't need to if the element marked with ignoreElements
  if (elem._ignoreElements) {
    return;
  }

  originalDestroyNode(elem);
};
