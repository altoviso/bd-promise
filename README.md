# bd-promise
### JS6 Promises with Timeouts and Other Extra Features 

FOSS software contributed by ALTOVISO ([http://www.altoviso.com](http://www.altoviso.com/)).


# Features

* Constructor includes optional timeout argument (in ms) to say the promise should cancel after that time has expired, e.g.:

 ```let p = new Promise(500, executor);```

* ```resolve(result)```, ```reject(error)```, and ```cancel(reason)``` methods

* ```resolved```, ```rejected```, and ```canceled``` getters

* ```result```, ```error```, and ```cancelReason``` getters


## Installation

With `npm`:

```
npm install bd-promise
```

With `yarn`:

```
yarn add bd-promise
```

With `bower`:

```
bower install --save bd-promise
```

## Tests

Serve the root directory then point a browser to test/index.html.

## License

bd-promise is free and open source software available under a BSD-3-Clause license.

