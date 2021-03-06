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
 *
 */

/**
 * A module representing the scale model
 * @module models-scale
 * @requires jQuery
 * @requires ACCESS
 * @requires collections-scalevalues
 * @requires backbone
 */
define(["jquery",
        "access",
        "collections/scalevalues",
        "backbone"],

    function ($, ACCESS, ScaleValues, Backbone) {

        "use strict";

        /**
         * @constructor
         * @see {@link http://www.backbonejs.org/#Model}
         * @augments module:Backbone.Model
         * @memberOf module:models-scale
         * @alias module:models-scale.Scale
         */
        var Scale = Backbone.Model.extend({

            /**
             * Default models value
             * @alias module:models-scale.Scale#defaults
             * @type {map}
             * @static
             */
            defaults: {
                created_at: null,
                created_by: null,
                updated_at: null,
                updated_by: null,
                deleted_at: null,
                deleted_by: null,
                access: ACCESS.PRIVATE
            },

            /**
             * Constructor
             * @alias module:models-scale.Scale#initialize
             * @param {object} attr Object literal containing the model initialion attributes.
             */
            initialize: function (attr) {
                _.bindAll(this, "toExportJSON");

                if (!attr  || _.isUndefined(attr.name) || attr.name === "") {
                    throw "'name' attribute is required";
                }

                if (attr.scaleValues && _.isArray(attr.scaleValues)) {
                    this.set({scaleValues: new ScaleValues(attr.scaleValues, this)});
                } else {
                    this.set({scaleValues: new ScaleValues([], this)});
                }

                if (attr.id) {
                    this.attributes.scaleValues.fetch({async: false});
                }

                // If localStorage used, we have to save the video at each change on the children
                if (window.annotationsTool.localStorage) {
                    if (!attr.created_by) {
                        attr.created_by = annotationsTool.user.get("id");
                    }

                    if (!attr.created_by_nickname) {
                        attr.created_by_nickname = annotationsTool.user.get("nickname");
                    }
                }

                if (annotationsTool.user.get("id") === attr.created_by) {
                    attr.isMine = true;
                } else {
                    attr.isMine = false;
                }

                // Check if the track has been initialized
                if (!attr.id) {
                    // If local storage, we set the cid as id
                    if (window.annotationsTool.localStorage) {
                        attr.id = this.cid;
                    }

                    this.toCreate = true;
                }

                if (attr.tags) {
                    attr.tags = this.parseJSONString(attr.tags);
                }

                this.set(attr);
            },

            /**
             * Parse the attribute list passed to the model
             * @alias module:models-scale.Scale#parse
             * @param  {object} data Object literal containing the model attribute to parse.
             * @return {object}  The object literal with the list of parsed model attribute.
             */
            parse: function (attr) {
                attr.created_at = attr.created_at !== null ? Date.parse(attr.created_at): null;
                attr.updated_at = attr.updated_at !== null ? Date.parse(attr.updated_at): null;
                attr.deleted_at = attr.deleted_at !== null ? Date.parse(attr.deleted_at): null;

                if (annotationsTool.user.get("id") === attr.created_by) {
                    attr.isMine = true;
                } else {
                    attr.isMine = false;
                }

                if (attr.tags) {
                    attr.tags = this.parseJSONString(attr.tags);
                }

                return attr;
            },


            /**
             * Validate the attribute list passed to the model
             * @alias module:models-scale.Scale#validate
             * @param  {object} data Object literal containing the model attribute to validate.
             * @return {string}  If the validation failed, an error message will be returned.
             */
            validate: function (attr) {
                var tmpCreated,
                    scalevalues;

                if (attr.id) {
                    if (this.get("id") !== attr.id) {
                        this.id = attr.id;
                        this.setUrl();

                        scalevalues = this.attributes.scaleValues;

                        if (scalevalues && (scalevalues.length) === 0) {
                            scalevalues.fetch({async: false});
                        }
                    }
                }

                if (attr.name && !_.isString(attr.name)) {
                    return "'name' attribute must be a string";
                }

                if (attr.description && !_.isString(attr.description)) {
                    return "'description' attribute must be a string";
                }

                if (attr.access && !_.include(ACCESS, attr.access)) {
                    return "'access' attribute is not valid.";
                }

                if (attr.created_at) {
                    if ((tmpCreated = this.get("created_at")) && tmpCreated !== attr.created_at) {
                        return "'created_at' attribute can not be modified after initialization!";
                    } else if (!_.isNumber(attr.created_at)) {
                        return "'created_at' attribute must be a number!";
                    }
                }

                if (attr.updated_at && !_.isNumber(attr.updated_at)) {
                    return "'updated_at' attribute must be a number!";
                }

                if (attr.deleted_at && !_.isNumber(attr.deleted_at)) {
                    return "'deleted_at' attribute must be a number!";
                }
            },

            /**
             * Override the default toJSON function to ensure complete JSONing.
             * @alias module:models-scale.Scale#toJSON
             * @return {JSON} JSON representation of the instance
             */
            toJSON: function () {
                var json = Backbone.Model.prototype.toJSON.call(this);

                if (json.tags) {
                    json.tags = JSON.stringify(json.tags);
                }
                delete json.scaleValues;

                return json;
            },

            /**
             * Prepare the model as JSON to export and return it
             * @alias module:models-scale.Scale#toExportJSON
             * @return {JSON} JSON representation of the model for export
             */
            toExportJSON: function () {
                var json = {
                    id: this.id,
                    name: this.attributes.name,
                    scaleValues: this.attributes.scaleValues.toExportJSON()
                };

                if (this.attributes.tags) {
                    json.tags = JSON.stringify(this.attributes.tags);
                }

                if (this.attributes.description) {
                    json.description = this.attributes.description;
                }

                return json;
            },


            /**
             * Parse the given parameter to JSON if given as String
             * @alias module:models-scale.Scale#parseJSONString
             * @param  {string} parameter the parameter as String
             * @return {JSON} parameter as JSON object
             */
            parseJSONString: function (parameter) {
                if (parameter && _.isString(parameter)) {
                    try {
                        parameter = JSON.parse(parameter);
                    } catch (e) {
                        console.warn("Can not parse parameter '" + parameter + "': " + e);
                        return undefined;
                    }
                } else if (!_.isObject(parameter) || _.isFunction(parameter)) {
                    return undefined;
                }

                return parameter;
            },

            /**
             * Modify the current url for the annotations collection
             * @alias module:models-scale.Scale#setUrl
             */
            setUrl: function () {
                if (this.attributes.scaleValues) {
                    this.attributes.scaleValues.setUrl(this);
                }
            }
        });
        return Scale;
    }
);