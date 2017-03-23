(function() {
    var HashArg = {};
    HashArg.get = function(argdefs, argv) {
        var args = {};
        if(!argv || argv === process.argv) {
            argv = [];
            for(var i = 2; i < process.argv.length; i++) {
                argv.push(process.argv[i]);
            }
        }
        if(typeof(argdefs) === 'string') {
            if(argdefs.match(/;/)) {
                argdefs = argdefs.split(/\s*;\s*/);
            } else {
                argdefs = argdefs.split(/\s+/);
            }
        }
        for(var i = 0; i < argdefs.length; i++) {
            var argdef = argdefs[i];
            var type = "string";
            var isArray = false;
            var name = "#" + i;
            var value = null;
            if(typeof(argdef) === 'string') {
                if(argdef.match(/\s+/)) {
                    var def = argdef.split(/\s+/);
                    type = def[0];
                    if(type.match(/\[\]$/)) {
                        if(i != argdefs.length - 1) {
                            throw new Error(
                                    "The array type can be specified for the last argument.",
                                    "definition: '" + argdef + "'.");
                        } else {
                            isArray = true;
                        }
                        type = type.replace(/\[\]$/, '');
                    }
                    name = def[1];
                } else {
                    name = argdef;
                }
                if(i < argv.length) {
                    value = argv[i];
                }
            } else if("name" in argdef) {
                if("type" in argdef) {
                    type = argdef.type;
                }
                name = argdef.name;
                if(i < argv.length) {
                    value = argv[i];
                } else if("default" in argdef) {
                    value = argdef["default"];
                }
            }
            switch(type) {
            case "string":
                if(isArray) {
                    value = [];
                    while(i < argv.length) {
                        value.push(argv[i]);
                        i++;
                    }
                }
                break;
            case "number":
                if(isArray) {
                    value = [];
                    while(i < argv.length) {
                        var element = parseFloat(argv[i]);
                        if(isNaN(element)) {
                            element = "NaN";
                        }
                        value.push(element);
                        i++;
                    }
                } else {
                    value = parseFloat(value);
                    if(isNaN(value)) {
                        value = "NaN";
                    }
                }
                break;
            }
            args[name] = value;
        }

        //
        // Undefiend extra parameters are stored into an array
        // of the blank key in the return object.
        //
        if(i < argv.length) {
            args[""] = [];
        }
        for(; i < argv.length; i++) {
            args[""].push(argv[i]);
        }
        return args;
    };
    module.exports = HashArg;
}());
