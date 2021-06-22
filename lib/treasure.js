var record = require('./record')
var _ = require('./utils/lodash')
var configurator = require('./configurator')
var version = require('./version')
var cookie = require('./vendor/js-cookies')
var config = require('./config')

/**
 * Treasure Data Javascript SDK 
 * @module treasure
 * @typicalname td 
 * 
 */


/**
 * @description Creates a new Treasure logger instance. If the database does not exist and you have permissions, it will be created for you.
 * @param {Treasure.config} config - Treasure Data instance configuration parameters
 * @see {@link config}
 * 
 * @returns {td_instance} Treasure logger instance object
 * 
 * @example 
 * var foo = new Treasure({
 *   database: 'foo',
 *   writeKey: 'your_write_only_key'
 * });
 * 
 * */
function Treasure (options) {
  // enforces new
  if (!(this instanceof Treasure)) {
    return new Treasure(options)
  }

  this.init(options)

  return this
}


Treasure.prototype.init = function (options) {
  this.configure(options)

  for (var plugin in Treasure.Plugins) {
    if (Treasure.Plugins.hasOwnProperty(plugin)) {
      Treasure.Plugins[plugin].configure.call(this, options)
    }
  }

  if (window.addEventListener) {
    var that = this
    window.addEventListener('pagehide', function () {
      that._windowBeingUnloaded = true
    })
  }
}


Treasure.version = Treasure.prototype.version = version


Treasure.prototype.log = function () {
  var args = ['[' + config.GLOBAL + ']']
  for (var i = 0, len = arguments.length - 1; i <= len; i++) {
    args.push(arguments[i])
  }
  if (typeof console !== 'undefined' && this.client.logging) {
    console.log.apply(console, args)
  }
}

Treasure.prototype.configure = configurator.configure
Treasure.prototype.set = configurator.set
Treasure.prototype.get = configurator.get
Treasure.prototype.ready = require('domready')
Treasure.prototype.applyProperties = record.applyProperties
Treasure.prototype.addRecord = record.addRecord
Treasure.prototype.addConsentRecord = record.addConsentRecord
Treasure.prototype._sendRecord = record._sendRecord
Treasure.prototype.blockEvents = record.blockEvents
Treasure.prototype.unblockEvents = record.unblockEvents
Treasure.prototype.areEventsBlocked = record.areEventsBlocked
Treasure.prototype.setSignedMode = record.setSignedMode
Treasure.prototype.setAnonymousMode = record.setAnonymousMode
Treasure.prototype.inSignedMode = record.inSignedMode
Treasure.prototype.getCookie = cookie.getItem
Treasure.prototype._configurator = configurator

// Plugins
Treasure.Plugins = {
  Clicks: require('./plugins/clicks'),
  GlobalID: require('./plugins/globalid'),
  Personalization: require('./plugins/personalization'),
  Track: require('./plugins/track'),
  ServerSideCookie: require('./plugins/servercookie'),
  ConsentManager: require('./plugins/consent-manager').default
}

// Load all plugins
_.forIn(Treasure.Plugins, function (plugin) {
  _.forIn(plugin, function (method, name) {
    if (!Treasure.prototype[name]) {
      Treasure.prototype[name] = method
    }
  })
})

module.exports = Treasure
