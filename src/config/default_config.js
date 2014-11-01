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
            command: 'throttle',
            singleShot: true,
            value: 0.125
        },
        'e': {
            command: 'throttle',
            singleShot: true,
            value: -0.125
        },
        'x': {
            command: 'all-stop',
            singleShot: true
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