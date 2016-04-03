hash-arg 
========

The __hash-arg__ is a simple module for node.js to get
an argv as an object represented by specified keys.


## Simple use with 'process.argv'

Simply, get method names each elements in process.argv.

__simple.js__

```
args = require("hash-arg").get(
        "inputFilePath outputFilePath");

console.log(JSON.stringify(args, null, "  "));
```

Outputs:

```
$ node test/simple.js input.json output.json
{
  "inputFilePath": "input.json",
  "outputFilePath": "output.json"
}
```

## Using with an argv parser like 'node-getopt' module

The optional second parameter of the get method is normal array.
So, for instance, you can specify a `node-getopt`'s argv property for it.

__with-node-argv.js__

```
getopt = require("node-getopt").create([
    ['s', '', 'short option'],
    ['l', 'long', 'long option'],
    ['S', 'short-with-arg=ARG', 'option with argument']
]).parseSystem();

args = require("hash-arg").get([
        "inputFilePath",
        {
            "name":"outputFilePath",
            "default": "out.json"
        }
        ], getopt.argv);

console.log(JSON.stringify(args, null, "  "));
```

Outputs:

```
$ node test/with-node-getopt.js -S DUMMY input.json -sl output.json
{
  "inputFilePath": "input.json",
  "outputFilePath": "output.json"
}
```

## METHOD GET

__prototype__

`HashArg.get(<argument-def> [, <argv-source-array>]);`

### argument-def

This can be specified as a string, an array of string,
or an array of definition object.

__1) string__

The string that contains parameter names separated by space.

```
"inputFilePath outputFilePath"
```

__2) Array of string__

Each element represents the parameter name.

```
["inputFilePath", "outputFilePath"]
```

__3) Array of definition object__

In this format, You can specify a special default value.

When the default was not declared, null value will be used.

```
[
    {"name":"inputFilePath"},
    {
        "name"      : "outputFilePath",
        "default"   : "out.json"
    }
]
```

### argv-source-array (optional)

An array of string to parse as command line parameters.

The `process.argv` is used by default, when it is not specified,

LICENCE
-------

MIT
