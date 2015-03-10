// ---------------------------------------------------------------------------------------------------------------------
// Configuration Manager
//
// @module configman.js
// ---------------------------------------------------------------------------------------------------------------------

function ConfigurationManagerFactory($rootScope, _, defaultConfig, socket, local)
{
    function ConfigurationManager()
    {
        this.configStore = local.getStore('config');
    } // end ConfigurationManager

    ConfigurationManager.prototype.getConfigs = function()
    {
        var self = this;
        socket.makeRequest('get config')
            .spread(function(results) {
                if(results.confirm)
                {
                    self.configs = results.configs;

                    var defaultConfigID = self.configStore.get('default');
                    if (defaultConfigID) {
                        self.setConfig(defaultConfigID);
                    }
                    else
                    {
                        if (results[0])
                        {
                            self.setConfig(results[0].id);
                        }
                        else
                        {
                            self.setConfig();
                        } // end if
                    } // end if
                } // end if
            }); // end spread
    }; // end getConfigs

    ConfigurationManager.prototype.setConfig = function(configID)
    {
        if(!configID && this.configs.length === 0)
        {
            this.configs = [defaultConfig];
            this.activeConfig = this.configs[0];
        }
        else
        {
            this.activeConfig = _.find(this.configs, { id: configID });
        } // end if

        $rootScope.$broadcast('config load');
    }; // end setConfig

    ConfigurationManager.prototype.saveConfig = function(newConfig)
    {
        socket.makeRequest('save config', newConfig)
            .then(function(response)
            {
                // TODO: handle errors here
                $rootScope.$broadcast('config saved', response.id);
            });
    };

    return new ConfigurationManager();
} // end ConfigurationManagerFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('ConfigurationManager',  [
    '$rootScope',
    'lodash',
    'defaultConfig',
    'SocketService',
    'LocalStorageService',
    ConfigurationManagerFactory
]);

// ---------------------------------------------------------------------------------------------------------------------