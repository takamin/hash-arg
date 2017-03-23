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

If the string contains ';' character, each elements splited by the character declare the type and name.

```
"string inputFilePath; number countOfFile"
```

Or, following type specification is available too.
It is used in a UML class diagram.

```
"inputFilePath string; countOfFile:number"
```

__2) Array of string__

Each element represents the parameter name.

```
["inputFilePath", "outputFilePath"]
```

_type declaration_:

If the declaration is separated by space, it represents the type and its name.

```
["string inputFilePath", "number countOfFile"]
```

And, Following is available too.

```
["inputFilePath:string", "countOfFile:number"]
```

__3) Array of definition object__

In this format, You can specify the type of the value that is 'string' or 'number', and the default value.

The default type is 'string'.

When the default value is not declared, null will be used.

```
[
    {"name":"inputFilePath"},
    {
        "name"      : "outputFilePath",
        "type"      : "string" // 'string' or 'number'
        "default"   : "out.json"
    }
]
```

### Type Specification

To specify the type to a named parameter.
Following two styles are available.

1. _<type>_ _<name>_ ( C/C++ style )
2. _<name>_:_<type>_ ( UML )


### Array Type Specification

The last argument can be set as an array.
The rest arguments in the list will be contained to the parameter.

To specify, pair of square brackets could be put after the type name.
The brackets must be empty.

Followings are all now available.

```
["string inputFilePath", "number[] countOfFile"]
```

```
["inputFilePath:string", "countOfFile:number[]"]
```

```
[
    {"name":"inputFilePath"},
    {
        "name"      : "outputFilePath",
        "type"      : "string[]"
    }
]
```

### argv-source-array (optional)

An array of string to parse as command line parameters.

The `process.argv` is used by default, when it is not specified,

LICENCE
-------

MIT
