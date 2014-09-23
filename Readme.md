# RFI: Precursors Client

This is a WebGL client for the RFI: Precursors MMORPG. It is an experimental endeavour, attempting to see how viable an
MMO client will be in pure web technologies.

## Current Status

Right now, it's able to perform a login with the server, but that's it. Our hope is to replace our current C++/QML 
client shortly.

## Development

To get started, you will need to install npm modules. Simple do:

```bash
$ npm install
```

Next you will need to have the [Grunt](http://gruntjs.com/) cli tools installed:

```bash
$ npm install -g grunt-cli
```

Now, you can run grunt, and get to developing:

```bash
grunt devel
```

This will start a server on [localhost:2695](http://localhost:2695), and setup a watch to rebuild the app. (All files 
are located in the `dist` folder.)