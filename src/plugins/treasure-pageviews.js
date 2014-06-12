  /*! 
  * ----------------------
  * Treasure Plugin
  * Auto Pageview Tracker
  * ----------------------
  */

  /*
  var AutoTracking = Treasure.Plugins.AutoPageviewTracking = {
    configure: function(instance, configuration){
      var client = (instance instanceof Treasure) ? instance : false,
          config = configuration.pageviews || false,
          defaults, options, override_addons;
          
      if (!client || (_type(config) !== 'Object' && _type(config) !== 'Boolean')) {
        return; // Configuration error somewhere upstream
      }
      
      defaults = {
        table: 'pageview',
        params: ['utm_content', 'utm_source', 'utm_medium', 'utm_term', 'utm_campaign'],
        data: {
          referrer: document.referrer,
          page: {
            title: document.title,
            host: document.location.host,
            href: document.location.href,
            path: document.location.pathname,
            protocol: document.location.protocol.replace(/:/g, ''),
            query: document.location.search
          }
        }
      };
      
      config = (typeof config !== 'undefined' && config !== null & _type(config) == 'Object') ? config : false;
      config['data'] = (typeof config['data'] !== 'undefined' && config['data'] !== null && _type(config['data']) == 'Object') ? config['data'] : false;

      if (config) {
        if (config['data']) {
          defaults['data'] = config['data'];
        } else {
          config['data'] = defaults['data'];
        }
        options = _extend(defaults, config);
      } else {
        options = defaults;
      }
      
      // Get values for whitelisted params
      // ----------------------------------
      for (var i = 0; i < options['params'].length; i++) {
        var match = RegExp('[?&]' + options['params'][i] + '=([^&]*)').exec(document.location.search);
        var result = match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        if (result !== null) {
          options['data'][options['params'][i]] = result;
        }
      }
      
      // Set treasure.timestamp if it doesn't exist
      // ---------------------------------------
      options['data']['treasure'] = options['data']['treasure'] || {};
      options['data']['treasure']['timestamp'] = options['data']['treasure']['timestamp'] || new Date().toISOString();
      
      // Send pageview event
      // ----------------------------------
      //console.log('data', options['data']);
      client.addEvent(options['table'], options['data']);
    }
  }
  
  Treasure.on('client', function(response){
    Treasure.Plugins.AutoPageviewTracking.configure.apply(this, arguments);
  });
  */