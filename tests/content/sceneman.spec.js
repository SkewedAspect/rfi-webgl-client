// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the SceneManager.
//
// @module sceneman.spec.js
// ---------------------------------------------------------------------------------------------------------------------

describe('SceneManager', function()
{
    var sceneMan;

    beforeEach(function()
    {
        angular.mock.module('rfi-client.services');
        inject(function(SceneManager)
        {
            sceneMan = SceneManager;
        });
    });

    it('should do something', function()
    {
        expect(function()
        {
            throw new Error("Not implemented");
        }).not.toThrow();
    });
});

// ---------------------------------------------------------------------------------------------------------------------
