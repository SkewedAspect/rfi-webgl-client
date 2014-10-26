// ---------------------------------------------------------------------------------------------------------------------
// The default client configuration.
//
// @module default_config.js
// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    keyboard: {
        'w': {
            command: 'pitch',
            value: -0.5
        },
        's': {
            command: 'pitch',
            value: 0.5
        },
        'a': {
            command: 'heading',
            value: -0.5
        },
        'd': {
            command: 'heading',
            value: 0.5
        },
        'q': {
            command: 'roll',
            value: 0.5
        },
        'e': {
            command: 'roll',
            value: -0.5
        },
        'c': {
            command: 'crouch',
            toggle: true
        },
        'space': {
            command: 'fire'
        },
        'f1': {
            command: 'test',
            value: ['arg1', 0.99, true]
        }
    }
}; // end exports

// ---------------------------------------------------------------------------------------------------------------------