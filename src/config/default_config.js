// ---------------------------------------------------------------------------------------------------------------------
// The default client configuration.
//
// @module default_config.js
// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
    keyboard: {
        'w': {
            command: 'pitch',
            onValue: -0.95,
            offValue: 0
        },
        's': {
            command: 'pitch',
            onValue: 0.95,
            offValue: 0
        },
        'a': {
            command: 'heading',
            onValue: -0.95,
            offValue: 0
        },
        'd': {
            command: 'heading',
            onValue: 0.95,
            offValue: 0
        },
        'q': {
            command: 'roll',
            onValue: 0.95,
            offValue: 0
        },
        'e': {
            command: 'roll',
            onValue: -0.95,
            offValue: 0
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