(function() {
    "use strict";
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
            var type = "";
            var isArray = false;
            var name = "#" + i;
            var value = null;
            if(typeof(argdef) === 'string') {
                let method = getTspecMethod(argdef);
                let argdef_default = null;
                if(argdef.match(/=/)) {
                    let dflset = argdef.split(/\s*=\s*/);
                    argdef = dflset[0];
                    argdef_default = dflset[1];
                }
                if(method != null) {
                    let typeSpec = analyzeArgDef(method, argdef);
                    name = typeSpec.name;
                    type = typeSpec.baseType;
                    isArray = typeSpec.isArray;
                } else {
                    name = argdef;
                }
                if(i < argv.length) {
                    value = argv[i];
                } else {
                    if(argdef_default != null && argdef_default != "") {
                        let json = JSON.parse("{\"X\":" + argdef_default + "}");
                        value = json.X;
                    } else {
                        value = argdef_default;
                    }
                }
            } else if("name" in argdef) {
                if("type" in argdef) {
                    type = argdef.type;
                    isArray = isArrayType(argdef.type);
                    type = getBaseType(argdef.type);
                }
                name = argdef.name;
                if(i < argv.length) {
                    value = argv[i];
                } else if("default" in argdef) {
                    value = argdef["default"];
                }
            }
            if(isArray && i != argdefs.length - 1) {
                throw new Error(
                        "The array type can be specified for the last argument.",
                        "definition: '" + argdef + "'.");
            }
            switch(type) {
            case "":
                if(isArray) {
                    value = [];
                    while(i < argv.length) {
                        value.push(argv[i]);
                        i++;
                    }
                }
                break;
            case "string":
                if(isArray) {
                    value = [];
                    while(i < argv.length) {
                        value.push(argv[i]);
                        i++;
                    }
                } else if(value != null) {
                    value = value.toString();
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

    // Methods to specify a type
    let TSPEC_METHODS = [
        {re: /:/,   iName: 0, iType: 1 },
        {re: /\s+/, iName: 1, iType: 0 }
    ];

    function getTspecMethod(argdef) {
        for(let i = 0; i < TSPEC_METHODS.length; i++) {
            if(argdef.match(TSPEC_METHODS[i].re)) {
                return TSPEC_METHODS[i];
            }
        }
        return null;
    }

    function analyzeArgDef(method, argdef) {
        let def = argdef.split(method.re, 2);
        let stype = def[method.iType].trim();
        return {
            name: def[method.iName].trim(),
            isArray: isArrayType(stype),
            baseType: getBaseType(stype)
        };
    }
    function isArrayType(typeSpec) {
        return typeSpec.match(/\[\]$/);
    }
    function getBaseType(typeSpec) {
        return typeSpec.replace(/\[\]$/, '');
    }
    module.exports = HashArg;
}());
