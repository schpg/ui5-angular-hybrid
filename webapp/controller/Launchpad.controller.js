sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";
  return Controller.extend("de.exxcellent.angularlaunchpad.controller.Launchpad", {

    sources: [{
      name: "runtime-es2015.js",
      defer: false,
      module: true
    }, {
      name: "runtime-es5.js",
      defer: false,
      module: false
    },{
      name: "polyfills-es5.js",
      defer: false,
      module: false
    }, {
      name: "polyfills-es2015.js",
      defer: false,
      module: true
    }, {
      name: "main-es2015.js",
      defer: false,
      module: true
    }, {
      name: "main-es5.js",
      defer: false,
      module: false
    }],

    style: "styles.css",

    dir: "webapp/assets/EmbeddedAngular",

    onInit: function () {
      let jsonModel = new sap.ui.model.json.JSONModel();
      sap.ui.getCore().getEventBus().subscribe("UI5Channel", "angularToUi5", function (channel, event, data) {
        jsonModel.setProperty("/text", data.text);
      });
      this.getView().setModel(jsonModel);
    },

    attachStyle: function () {
      let link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = this.dir + "/" + this.style;
      document.head.appendChild(link);
    },

    attachAngularBootstrapScripts: function () {
      let that = this;

      window.ui5EventBus = sap.ui.getCore().getEventBus();
      let scriptLoadingPromises = this.sources.map(function (source) {
        return new Promise(function (resolve) {
          let scriptElement = document.createElement("script");
          scriptElement.src = that.dir + "/" + source.name;
          if (source.defer) {
            scriptElement.setAttribute("defer", "");
          }
          if (source.module) {
            scriptElement.type = "module";
            scriptElement.onload = resolve;
          } else {
            scriptElement.setAttribute("nomodule", "");
            resolve();
          }
          document.head.appendChild(scriptElement);
        });
      });
      return Promise.all(scriptLoadingPromises);
    },

    attachAngularAnker: function () {
      let htmlDiv = this.byId("angularDiv");
      htmlDiv.setDOMContent("<div style='height: 100%; width: 100%'><app-root></app-root></div>");
    },

    attachZoneScript: function () {
      let scriptElement = document.createElement("script");
      scriptElement.src = "./lib/zone.js";
    },

    resetHeight: function () {
      $("#container").css("height", "100%");
      $("#container-uiarea").css("height", "100%");
    },

    sendByEventBus: function () {
      sap.ui.getCore().getEventBus().publish("UI5Channel", "ui5ToAngular", {
        text: "Hello Angular"
      });
    },

    startAngularApp: function () {
      this.attachAngularAnker();
      this.attachZoneScript();
      this.attachStyle();
      this.attachAngularBootstrapScripts().then(this.resetHeight.bind(this));
    }
  });
});