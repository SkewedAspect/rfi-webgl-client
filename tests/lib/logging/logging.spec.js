// ---------------------------------------------------------------------------------------------------------------------
// Unit Tests for the logging.spec.js module.
//
// @module logging.spec.js
// ---------------------------------------------------------------------------------------------------------------------

describe('Logging Service', function()
{
    beforeEach(module("rfi-client.services"));

    var logging, $log;
    beforeEach(inject(function(_LoggingService_, _$log_)
    {
        logging = _LoggingService_;
        $log = _$log_;

        spyOn($log, 'debug');
        spyOn($log, 'info');
        spyOn($log, 'warn');
        spyOn($log, 'error');
    }));

    describe('#debug()', function()
    {
        it('writes a debug string to the console', function()
        {
            logging.debug('test');
            expect($log.debug).toHaveBeenCalled();
        });
    });

    describe('#info()', function()
    {
        it('writes a info string to the console', function()
        {
            logging.info('test');
            expect($log.info).toHaveBeenCalled();
        });
    });

    describe('#warn()', function()
    {
        it('writes a warn string to the console', function()
        {
            logging.warn('test');
            expect($log.warn).toHaveBeenCalled();
        });
    });

    describe('#error()', function()
    {
        it('writes a error string to the console', function()
        {
            logging.error('test');
            expect($log.error).toHaveBeenCalled();
        });
    });
});

// ---------------------------------------------------------------------------------------------------------------------