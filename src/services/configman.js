// ---------------------------------------------------------------------------------------------------------------------
// Configuration Manager
//
// @module configman.js
// ---------------------------------------------------------------------------------------------------------------------

function ConfigurationManagerFactory($rootScope, socket, local)
{
    function ConfigurationManager()
    {
        this.configStore = local.getStore('config');
    } // end ConfigurationManager

    ConfigurationManager.prototype.getConfigs = function()
    {
        var self = this;
        socket.request('get config')
            .spread(function(results) {
                self.configs = results;

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
                        // TODO: else - use client default config
                    } // end if
                } // end if
            }); // end spread
    }; // end getConfigs

    ConfigurationManager.prototype.setConfig = function(configID)
    {
        this.activeConfig = _.find(this.configs, { id: configID });
        $rootScope.$broadcast('config load');
    };

    return new ConfigurationManager();
} // end ConfigurationManagerFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('ConfigurationManager',  [
    '$rootScope',
    'SocketService',
    'LocalStorageService',
    ConfigurationManagerFactory
]);

// ---------------------------------------------------------------------------------------------------------------------