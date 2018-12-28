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

App.LoginView = Em.View.extend({

  templateName: require('templates/login'),

  didInsertElement : function() {

    this.initFunction();

  },

  initFunction : function() {
    var body = $(document.body);
    document.body.style.backgroundImage="url('/img/login.png')"; //改变背景图片

  //   document.body.style.cssText='height: 100%;min-height: 100%; background-repeat: no-repeat;background-image: url("/img/login.png");background-size: cover;");';
  },

  loginTextField: Em.TextField.extend({
    didInsertElement: function(){
      this._super();
      this.$().focus();
    }
  }),
  passTextField : Em.TextField.extend({
    insertNewline: function(){
      this.get("controller").submit();
    }
  })
});