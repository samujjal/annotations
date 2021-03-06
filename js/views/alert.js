/**
 *  Copyright 2012, Entwine GmbH, Switzerland
 *  Licensed under the Educational Community License, Version 2.0
 *  (the "License"); you may not use this file except in compliance
 *  with the License. You may obtain a copy of the License at
 *
 *  http://www.osedu.org/licenses/ECL-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an "AS IS"
 *  BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 *  or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 */

/**
 * A module representing the alert modal
 * @module views-alert
 * @requires jQuery
 * @requires Backbone
 * @requires templates/alert-modal.tmpl
 * @requires ROLES
 * @requires hanldebars
 */
define(["jquery",
        "backbone",
        "text!templates/alert-modal.tmpl",
        "roles",
        "handlebars"],

        function ($, Backbone, AlertTmpl, ROLES, Handlebars) {

            "use strict";

            /**
             * @constructor
             * @see {@link http://www.backbonejs.org/#View}
             * @augments module:Backbone.View
             * @memberOf module:views-alert
             * @alias Alert
             */
            var alertView = Backbone.View.extend({

                el: $("#alert"),

                /**
                 * Alert template
                 * @alias module:views-alert.Alert#alertTemplate
                 * @type {Handlebars template}
                 */
                alertTemplate: Handlebars.compile(AlertTmpl),

                /**
                 * Events to handle
                 * @alias module:views-alert.Alert#events
                 * @type {object}
                 */
                events: {
                    "click #confirm-alert": "hide"
                },

                /**
                 * Supported type of alert. Each of the type is represented as object and must have a title and a class property.
                 * @alias module:views-alert.Alert#TYPES
                 * @type {PlainObject}
                 * @constant
                 */
                TYPES: {
                    ERROR: {
                        title    : "Error!",
                        className: "alert-error"
                    },
                    WARNING: {
                        title    : "Warning!",
                        className: ""
                    },
                    INFO : {
                        title    : "Information",
                        className: "alert-info"
                    }
                },

                /**
                 * Constructor
                 * @alias module:views-alert.Alert#initialize
                 */
                initialize: function () {
                    _.bindAll(this, "show", "hide");
                },

                /**
                 * Display the modal with the given message as the given alert type
                 * @alias module:views-alert.Alert#show
                 * @param  {String} message The message to display
                 * @param  {String or Object} type The name of the alert type or the type object itself, see {@link module:views-alert.Alert#TYPES}
                 */
                show: function (message, type) {
                    var params;

                    if (_.isUndefined(message) || _.isUndefined(type) ||
                        (_.isString(type) && _.isUndefined(this.TYPES[type.toUpperCase()])) ||
                        (_.isObject(type) && (_.isUndefined(type.title)  || _.isUndefined(type.className)))) {
                        throw "Alert modal requires a valid type and a message!";
                    }

                    if (_.isString(type)) {
                        params = _.extend(this.TYPES[type.toUpperCase()], {message: message});
                    } else {
                        params = _.extend(type, {message: message});
                    }

                    this.$el.empty();
                    this.$el.append(this.alertTemplate(params));
                    this.delegateEvents();

                    this.$el.modal({show: true, backdrop: false, keyboard: false });
                },

                /**
                 * Hide the modal
                 * @alias module:views-alert.Alert#hide
                 */
                hide: function () {
                    this.$el.modal("hide");
                }
            });

            return alertView;

        }
);