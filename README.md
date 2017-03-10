# mongoose-nested

Mongoose Nested Schema

## Installation

```bash
$ npm install antena-mongoose-nested
```

## Usage

```javascript
require('antena-mongoose-nested');

var __NestedPropertySchema; // require nested model schema

var __schema = {
    someProperty: {type: Date},
    anotherProperty: {type: Date}
    aNestedProperty: __NestedPropertySchema.getNested(false)
};

// [ schema registration, indexes, etc, go here ]

exports.getNested = function (required) {
    return util._extend({
        type: "nested",
        required: required
    }, __schema);
};
```
