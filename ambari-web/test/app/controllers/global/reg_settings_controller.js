/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var App = require('app');


/**
 * Controller for user settings
 * Allows to get them from persist and update them to the persist
 *
 * @class RegSettingsController
 */
App.RegSettingsController = Em.Controller.extend(App.UserPref, {

  name: 'regSettingsController',

  /**
   * @const
   */
  REG_KEY: 'regkey',

  /**
   * name of user who working with wizard
   * @type {string|null}
   */
  wizardUser: null,

  /**
   * @type {string|null}
   */
  controllerName: null,

  /**
   * define whether Wizard is running
   * @type {boolean}
   */
  isWizardRunning: Em.computed.bool('wizardUser'),

  /**
   * @type {string}
   */
  wizardDisplayName: function() {
    if (this.get('controllerName')) {
      return Em.I18n.t('wizard.inProgress').format(App.router.get(this.get('controllerName')).get('displayName'));
    }
    return "";
  }.property('controllerName'),

  /**
   * define whether logged in user is the one who started wizard
   * @type {boolean}
   */
  isNonWizardUser: function() {
    return this.get('isWizardRunning') && this.get('wizardUser') !== App.router.get('loginName');
  }.property('App.router.loginName', 'wizardUser').volatile(),

  /**
   * set user who launched wizard
   * @returns {$.ajax}
   */
  setUser: function(controllerName) {
    return this.postUserPref(this.get('REG_KEY'), {
      userName: App.router.get('loginName'),
      controllerName: controllerName
    });
  },

  /**
   * reset user who launched wizard
   * @returns {$.ajax}
   */
  resetUser: function() {
    return this.postUserPref(this.get('REG_KEY'), "");
  },
  postUserPrefSuccessCallback: function (response, request, data) {
    if(response==0){
      alert("授权失败");
    }else {
      alert("已成功授权" + response + "个节点主机");
    }
  },

  /**
   * get user who launched wizard
   * @returns {$.ajax}
   */
  getUser: function() {
    return this.getUserPref(this.get('REG_KEY'));
  },

  getUserPrefSuccessCallback: function(data) {

    this._showSettingsPopup1(data);

  },


  /**
   * Open popup with user settings after settings-request is complete
   *
   * @method showSettingsPopup
   */
  showSettingsPopup: function() {
    var self = this;

    this.getUserPref(this.get('REG_KEY'));

  },
  /**
   * "Short"-key method for post user settings to the persist
   * Example:
   *  real key is something like 'userSettingsKeys.timezone.name'
   *  but user should call this method with 'timezone'
   *
   * @method postUserPref
   * @param {string} key
   * @param {*} value
   * @returns {*}
   */
  postUserPref: function (key, value) {

    return this._super(key, value);
  },


  getUserPrefErrorCallback: function (data) {

    this._showSettingsPopup1( data.responseText);
  },
  /**
   * Show popup with settings for user
   * Don't call this method directly! Use <code>showSettingsPopup</code>
   *
   * @param {object} response
   * @returns {App.ModalPopup}
   * @method _showSettingsPopup
   * @private
   */
  _showSettingsPopup1: function (response) {

    var curValue, self, timezonesFormatted, initValue, initTimezone;
    var strs= new Array(); //定义一数组
    strs=response.split("|||"); //字符分割
      curValue = null;
      self = this;

    //  initValue = JSON.parse(response[keys.show_bg.name]);
    initValue=strs[0];
      return App.ModalPopup.show({

        header: '注册认证',

        bodyClass: Em.View.extend({

          templateName: require('templates/common/regsettings'),

          isNotShowBgChecked: strs[0],
          jhnum: strs[1],

          updateValue: function () {
            curValue = this.get('isNotShowBgChecked');
          }.observes('isNotShowBgChecked'),


        }),

        /**
         * @type {string}
         */


        primary: Em.I18n.t('common.save'),
        onPrimary: function () {
          if (Em.isNone(curValue)) {
            curValue = initValue;
          }

          var popup = this;
          if (!App.get('testMode')) {
              self.postUserPref('regkey', curValue).always(function () {

                  location.reload();
              });
          }

          this._super();
        },

        /**
         * Determines if page should be refreshed after user click "Save"
         *
         * @returns {boolean}
         */

      });

  }
});
