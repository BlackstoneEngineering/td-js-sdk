/*
 * Treasure Configurator
 */


/**
 * @typedef {object} config
 * @property {string}        config.database                                 - database name, must consist only of lower case letters, numbers, and `_`, must be longer than or equal to 3 chars, and the total length of database and table must be shorter than 129 chars.
 * @property {string}        config.writeKey                                 - write-only key, get it from your user profile
 * @property {string}        [config.pathname]                               - path to append after host. Default: `/js/v3/events`
 * @property {string}        [config.host]                                   - host to which events get sent. Default: `in.treasuredata.com`
 * @property {boolean}       [config.development]                            - triggers development mode which causes requests to be logged and not get sent. Default: `false`
 * @property {boolean}       [config.logging]                                - enable or disable logging. Default: `true`
 * @property {string}        [config.globalIdCookie]                         - cookie td_globalid name. Default: `_td_global`
 * @property {boolean}       [config.startInSignedMode]                      - Tell the SDK to default to Signed Mode if no choice is already made. Default: `false`
 * @property {number}        [config.jsonpTimeout]                           - JSONP timeout (in milliseconds) Default: `10000`
 * @property {boolean}       [config.storeConsentByLocalStorage]             - Tell the SDK to use localStorage to store user consent. Default: `false`
 * @property {string}        [config.clientId]                               - uuid for this client. When undefined it will attempt fetching the value from a cookie if storage is enabled, if none is found it will generate a v4 uuid
 * @property {object|string} [config.storage]                                - storage configuration object. When `none` it will disable cookie storage
 * @property {string}        [config.storage.name]                           - cookie name. Default: `_td`
 * @property {integer}       [config.storage.expires]                        - cookie expiration in seconds. When 0 it will expire with the session. Default: `63072000` (2 years)
 * @property {string}        [config.storage.domain]                         - cookie domain. Default: result of `document.location.hostname`
 * @property {boolean}       [config.useServerSideCookie]                    - enables/disable using ServerSide Cookie. Default: `false`
 * @property {string}        [config.sscDomain]                              - Domain against which the Server Side Cookie is set. Default: `window.location.hostname`
 * @property {string}        [config.sscServer]                              - hostname to request server side cookie from. Default: `ssc.${sscDomain}`
 * @property {string}        [config.cdpHost]                                - The host to use for the Personalization API. Default: 'cdp.in.treasuredata.com'
 * */

// Modules
var _ = require('./utils/lodash')
var invariant = require('./utils/misc').invariant
var config = require('./config')
var cookie = require('./vendor/js-cookies')

// Helpers
function validateOptions (options) {
  // options must be an object
  invariant(
    _.isObject(options),
    'Check out our JavaScript SDK Usage Guide: ' +
      'http://docs.treasuredata.com/articles/javascript-sdk'
  )

  invariant(_.isString(options.writeKey), 'Must provide a writeKey')

  invariant(_.isString(options.database), 'Must provide a database')

  invariant(
    /^[a-z0-9_]{3,255}$/.test(options.database),
    'Database must be between 3 and 255 characters and must ' +
      'consist only of lower case letters, numbers, and _'
  )
}

var defaultSSCCookieDomain = function () {
  var domainChunks = document.location.hostname.split('.')
  for (var i = domainChunks.length - 2; i >= 1; i--) {
    var domain = domainChunks.slice(i).join('.')
    var name = '_td_domain_' + domain // append domain name to avoid race condition
    cookie.setItem(name, domain, 3600, '/', domain)
    if (cookie.getItem(name) === domain) {
      return domain
    }
  }
  return document.location.hostname
}

// Default config for library values
exports.DEFAULT_CONFIG = {
  database: config.DATABASE,
  development: false,
  globalIdCookie: '_td_global',
  host: config.HOST,
  logging: true,
  pathname: config.PATHNAME,
  requestType: 'jsonp',
  jsonpTimeout: 10000,
  startInSignedMode: false,
  useServerSideCookie: false,
  sscDomain: defaultSSCCookieDomain,
  sscServer: function (cookieDomain) {
    return ['ssc', cookieDomain].join('.')
  },
  storeConsentByLocalStorage: false
}

/*
 * Initial configurator
 * Checks validity
 * Creates and sets up client object
 *
 * Modify DEFAULT_CONFIG to change any defaults
 * Protocol defaults to auto-detection but can be set manually
 * host defaults to in.treasuredata.com
 * pathname defaults to /js/v3/event/
 * requestType is always jsonp
 *
 * */
exports.configure = function configure (options) {
  this.client = _.assign(
    {
      globals: {}
    },
    exports.DEFAULT_CONFIG,
    options,
    {
      requestType: 'jsonp'
    }
  )

  validateOptions(this.client)

  if (!this.client.endpoint) {
    this.client.endpoint = 'https://' + this.client.host + this.client.pathname
  }
  return this
}

/**
 * Useful when you want to set multiple values.
 * Table value setter
 * When you set mutliple attributes, the object is iterated and values are set on the table
 * Attributes are not recursively set on the table
 * 
 // * @memberof Treasure
 // * @function set
 * @param {string} table - table name
 * @param {object} properties - Object with keys and values that you wish applies on the table each time a record is sent 
 * 
 * @alias module:treasure.set
 * 
 * @example
 * var td = new Treasure({...})
 * td.set('table', {foo: 'foo', bar: 'bar'});
 * td.addRecord('table', {baz: 'baz'});
 * //  Sends:
 * // {
 * //   "foo": "foo",
 * //   "bar": "bar",
 * //   "baz": "baz"
 * // }
 */
exports.set = function set (table, property, value) {
  if (_.isObject(table)) {
    property = table
    table = '$global'
  }

  this.client.globals[table] = this.client.globals[table] || {}
  if (_.isObject(property)) {
    _.assign(this.client.globals[table], property)
  } else {
    this.client.globals[table][property] = value
  }

  return this
}

/**
 * Takes a table name and returns an object with its default values. 
 * If the table does not exist, its object gets created
 * 
 * NOTE: This is only available once the library has loaded. Wrap any getter with a Treasure#ready callback to ensure the library is loaded.
 // * @memberof Treasure
 // * @function get
 * @param {string} table - table name
 * @param {string} [key] - Optional key to get from the table
 * 
 * @alias module:treasure.get
 * 
 * @example <caption>Getting all rows in a table</caption>
 * var td = new Treasure({..});
 * td.set('table', 'foo', 'bar');
 * td.get('table');
 * // {foo: 'bar'}
 *
 * @example <caption>Getting a single attribute</caption>
 * var td = new Treasure({..});
 * td.get('table', 'foo')
 * // > 'bar'
 */
exports.get = function get (table, key) {
  // If no table, show $global
  table = table || '$global'

  this.client.globals[table] = this.client.globals[table] || {}
  return key ? this.client.globals[table][key] : this.client.globals[table]
}
