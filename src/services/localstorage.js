// ---------------------------------------------------------------------------------------------------------------------
// Local Storage service
//
// @module localstorage.js
// ---------------------------------------------------------------------------------------------------------------------

function LocalStorageSericeFactory()
{
    // -----------------------------------------------------------------------------------------------------------------

    function LocalStore(path)
    {
        this.path = path + '.';
    } // end LocalStore

    LocalStore.prototype.get = function(key, defaultVal)
    {
        var valStr = localStorage[this.path + key];

        if(valStr)
        {
            return angular.fromJson(valStr);
        }
        else
        {
            return defaultVal;
        } // end if
    }; // end get

    // -----------------------------------------------------------------------------------------------------------------

    LocalStore.prototype.set = function(key, object)
    {
        localStorage[this.path + key] = angular.toJson(object);
    }; // end set
    function LocalStorageService()
    {
        this.stores = {};
    } // end LocalStorageService

    LocalStorageService.prototype.getStore = function(name)
    {
        if(name in this.stores)
        {
            return this.stores[name];
        }
        else
        {
            this.stores[name] = new LocalStore(name);
            return this.stores[name];
        } // end if
    }; // end getStore

    return new LocalStorageService();
} // end LocalStorageServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.services').service('LocalStorageService', [LocalStorageSericeFactory]);

// ---------------------------------------------------------------------------------------------------------------------
