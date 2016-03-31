(function() {
    var HashArg = {};
    HashArg.get = function(argdefs, argv) {
        var args = {};
        if(!argv) {
            argv = [];
            for(var i = 2; i < process.argv.length; i++) {
                argv.push(process.argv[i]);
            }
        }
        if(typeof(argdefs) === 'string') {
            argdefs = argdefs.split(/\s*/);
        }
        for(var i = 0; i < argdefs.length; i++) {
            var argdef = argdefs[i];
            var name = "#" + i;
            var value = null;
            if(typeof(argdef) === 'string') {
                name = argdef;
                if(i < argv.length) {
                    value = argv[i];
                }
            } else if("name" in argdef) {
                name = argdef.name;
                if(i < argv.length) {
                    value = argv[i];
                } else if("default" in argdef) {
                    value = argdef["default"];
                }
            }
            args[name] = value;
        }
        return args;
    };
    module.exports = HashArg;
}());
