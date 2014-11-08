# RFI: Precursors Client

This is a WebGL client for the RFI: Precursors MMORPG. It is an experimental endeavour, attempting to see how viable an
MMO client will be in pure web technologies.

## Current Status

Right now, it's able to perform a login with the server, move around, and share state. Here's a video of the networking:

[![ScreenShot](http://img.youtube.com/vi/D_i3Mz5RMDs/0.jpg)](http://youtu.be/D_i3Mz5RMDs)

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

### Contributing

We welcome any contributions through the normal GitHub workflow: fork the repository and submit a pull request. All pull requests must meet the following standards to get merged:

* Follow the existing style/formating of the project
* Use existing code conventions (as used elsewhere in the project)
* Must be a targeted change; make multiple pull requests to fix multiple unrelated issues
* Must be reviewed by one of the core team prior to merging

We, of course, reserve the right not to merge any contributions. That being said, we're more than willing to dicuss changes, no matter how radical, if the pros outweigh the cons. If in doubt, before you do all this work, open an issue and start a discussion on the topic. Once a concensus emrges, then do your changes.

## Related Projects

These are the other projects that come together to make this game a reality:

* [rfi-server](https://github.com/SkewedAspect/rfi-server) - Our MMORPG server.
* [rfi-content](https://github.com/SkewedAspect/rfi-content) - The source files for all our content.
* [rfi-physics](https://github.com/SkewedAspect/rfi-phsyics) - A physics wrapper for both the client and server side.
