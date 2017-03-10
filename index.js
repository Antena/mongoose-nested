'use strict';

var async = require('async'),
    mongoose = require("mongoose"),
    SchemaTypes = mongoose.SchemaTypes,
    Schema = mongoose.Schema;

function Nested(path, options) {
    var required = options.required;
    var type = options.type;
    delete options.required;
    delete options.type;
    var topPath = path;
    
    SchemaTypes.Mixed.call(this, path, options);

    function validateChildren(arg, cb) {
        if (!required && !arg) {
            return cb(true);
        } else if (require && !arg) {
            return cb(false);
        }
        
        var self = this;
        var schema = new Schema(options, {
            _id: false
        });

        var validating = {},
            total = 0;

        schema.eachPath(validatePath);
        var errors = [];

        function validatePath(path) {
            if (validating[path]) {
                return;
            }
            
            validating[path] = true;
            total++;

            process.nextTick(function () {
                // console.log("valud",val)
                var p = schema.path(path);
                if (!p)
                    return --total || complete();
                var cPath = [topPath, path].join('.');
                var val = self.getValue(cPath);
                
                if (p.instance !== 'Array') {
                    p.doValidate(val, function (err) {
                        if (err) {
                            errors.push(err);
                            self.invalidate(cPath, err, undefined, true // embedded docs
                            );
                        }
                        if (--total == 0) {
                            complete();
                        }
                    }, self);
                } else {
                    if (--total == 0) {
                        complete();
                    }
                }

            });
        }

        function complete() {
            cb(!errors.length);
        }
    }

    this.validate(validateChildren);
}

Nested.prototype.__proto__ = SchemaTypes.Mixed.prototype;

SchemaTypes.Nested = Nested;

mongoose.Types.Nested = Nested; // Mixed;

