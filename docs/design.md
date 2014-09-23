# Client Design

There are a lot of things the client needs to do. As such, we need to put some thought into how to achieve this inside a
web application. What follows is my attempt to formalize the design.

## Window Size

The application is going to be limited to exactly the viewport. There will no scrolling of the page, period. Putting 
this restriction on all aspects of the site ensures that UI elements will be reusable between the 3D portion and the
more traditional pages.

## CSS Framework

A decision needs to be made about what framework we should pull in to aid our (currently) hand-rolled framework.

## Angular Application

First and foremost, this is an AngularJS application. This means we will be talking in terms of Routes, Directives, 
Controllers, Services and Partials.

### Event Driven

The primary design of this application will be using angular's [`$broadcast`](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$broadcast)
from the `$rootScope`. These events should primarily be user driven, therefore the rate they fire at will be low. (For
the case of network events, it is far more efficient for the logic interested in those to listen for those events 
directly from the socket service. In rare cases, they might then need to fire an angular event, however, this should be
limited and/or throttled.)

### Routes

There will be a few primary routes for the game:

* `/` - The main page; this should have a login window, and some navigation to the other routes. (3D background scene?)
* `/account` - This is your account page. It allows you to make account level changes. (Auth required, no 3D).
* `/lite` - A 'lite' version of the site that allows basic changes, but no gameplay. (Auth required, no 3D).

Both `/account` and `/lite` are optional, and do not need to be developed at the moment. However, it should be noted that
`/lite` gives us the opportunity to develop some gameplay elements without trying to figure out their 3D representation,
and should allow for reusable UI/logic components to be created.

### Services

What follows is a list of services that we need, and a bit about their purpose and design.

#### Authentication Service (`auth`)

This handles logging in to the server, and also maintains the state of our login.

#### Account Service (`account`)

Contains the account object sent to us by the server, as well as the logic for working with the account. (Most of this
service will be implemented at a later time, once accounts are more interesting.) It is assumed any code needing the
account will inject this service.

#### Character Service (`character`)

Contains the character object sent to us by the server, as well as the logic for working with the character. (Most of 
this service will be implemented at a later time, once characters are more interesting.) It is assumed any code needing 
the character will inject this service.

#### Socket Service (`socket`)

This service is designed to abstract away the fact that we're using socket.io as well as provide a fixed API in case we
decide to change. It also handles wrapping callbacks in a `$timeout(..., 0)` as a form of doing a safe `$apply`.

Currently, it uses the exact same API as socket.io, however, I propose we modify that:

```javascript
// Listen for events from the server
socket.on('event name', function(arg1, arg2)
{
    // Handle 'event name' here
});

// Fire an event to the server
socket.event('other event name', arg1, arg2);

// Make a request to the server
socket.request('request name', arg1, arg2)
    .then(function(replyArg1, replyArg2)
    {
        // Handle 'request name' reply here.
    });
```

This gives us some explicit control over whether or not we expect a reply, _and_ it should help us keep the code talking 
to the server nice and clean. This will be a very easy to implement API ontop of socket.io, or any other system we 
decide to employ.

#### Content Loader (`loader`)

The content loader's job is to load up the various assets and models we need, and build the scene in `three.js`. It will
need the following API calls:

* `loadModel( url:{String} )` - Loads a model from the given url. It should use an LRU cache to store the models, and 
attempt to load first from the cache, and then from the url.
* `loadLight( lightDef:{Object} )` - Loads a given definition for a light, and places it in the current scene. (Lights 
should not be cached.)
* `loadScene( url:{String} )` - Loads a given scene (json) from the url. (Scenes should not be cached, but their models 
can be.)

We will be required to define our own light and scene json structure, but that shouldn't be too difficult.

#### Entity Manager (`entityManager`)

The Entity manager has the following jobs:

* Register for events from the server
* Load/Remove entities when appropriate
* Apply updates to entities
* Allow for lookup of entities

These should actually be relatively simple, with most of the complication living in the behaviors.

#### Config Manager (`config`)

Requests the current configuration from the server, and manages it. It will need to do the following:

* Get the list of configurations on the server
* Allow for switching of configuration
* Fire an event to tell all services to reload their configuration

This implies that all services that use configuration will need to listen to a `reload config` event to know when they 
should reload said config.

#### Key Binding (`keys`)

Manages key bindings. Basically, it should just wrap [http://dmauro.github.io/Keypress/](http://dmauro.github.io/Keypress/).
It will need to check the `config` service, and load it's key bindings. The bindings will basically be a mapping of keys 
to an event and list of arguments. These events will be fired from `rootScope` down, so anyone that wants to listen for
the event, may.

#### Mouse Binding (`mouse`)

This is, essentially the exact same as the `keys` service. It listens for clicks/button presses, or mouse movement, and
fires off the correct events, with arguments.

### Directives

While there will need to be directives for multiple UI components, there are a few that we will need regardless of how
we build the UI.

#### Login Directive (`<login></login>`)

This is the login window. It's job is to allow a user to log in with a username and password, and then select their 
character. (Right now we don't have much support for logging in without eventually selecting a character, but we could 
change the flow to be more suited to that. If we do, this should just be the login window.)

#### Three.js Directive (`<game></game>`)

This is the WebGL canvas and logic for wrapping up `three.js`. This should handle some of the messy bits, like window
resize, etc.