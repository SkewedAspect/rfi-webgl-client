// ---------------------------------------------------------------------------------------------------------------------
// NgEnter
//
// @module ngEnter.js
// ---------------------------------------------------------------------------------------------------------------------

function NgEnterFactory()
{
    function NgEnterLink(scope, element, attrs)
    {
        element.bind('keydown keypress', function(event)
        {
            if(event.which === 13)
            {
                scope.$apply(function()
                {
                    scope.$eval(attrs.ngEnter, {$event: event});
                });

                event.preventDefault();
            } // end if
        });
    } // end NgEnterLink

    return {
        restrict: 'A',
        link: NgEnterLink
    };
} // end NgEnterFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rfi-client.utils').directive('ngEnter', [NgEnterFactory]);

// ---------------------------------------------------------------------------------------------------------------------