util = require('util');
HashArg = require('../lib/index.js');
(function() {
    var test_cases = [
        [
            "A B C", ["1","2"],
            {
                "A":"1",
                "B":"2",
                "C":null
            }
        ],[
            ["A", "B", "C"], ["1","2"],
            {
                "A":"1",
                "B":"2",
                "C":null
            }
        ],[
            [
                { "name": "A", "default":"" },
                { "name": "B", },
                { "name": "C", "default":1234 }
            ],
            [/* NO PARAMETER */],
            {
                "A" : "",
                "B" : null,
                "C" : 1234
            }
        ],[
            [
                { "name": "A", "default":"" },
                { "name": "B", },
                { "name": "C", "default":1234 }
            ],
            [ "AAA", "BBB", "CCC", "DDD", "EEE"],
            {
                "A" : "AAA",
                "B" : "BBB",
                "C" : "CCC",
                "": ["DDD", "EEE"]
            }
        ],[
            [
                { "name": "str", "type": "string" },
                { "name": "num", "type": "number" },
                { "name": "numstr", "type": "string" },
                { "name": "strnum", "type": "number" },
                { "name": "dflstr" }
            ],
            [ "AAA", "123", "123", "ABC", "456" ],
            {
                "str" : "AAA",
                "num" : 123,
                "numstr" : "123",
                "strnum" : "NaN",
                "dflstr": "456"
            }
        ],[
            [
                "string str",
                "number num",
                "string numstr",
                "number strnum",
                "dflstr"
            ],
            [ "AAA", "123", "123", "ABC", "456" ],
            {
                "str" : "AAA",
                "num" : 123,
                "numstr" : "123",
                "strnum" : "NaN",
                "dflstr": "456"
            }
        ],[
            "string str;number num; string numstr ;number strnum  ;  dflstr",
            [ "AAA", "123", "123", "ABC", "456" ],
            {
                "str" : "AAA",
                "num" : 123,
                "numstr" : "123",
                "strnum" : "NaN",
                "dflstr": "456"
            }
        ],[
            ["string[] str"],
            [ "AAA", "123", "123", "ABC", "456" ],
            {
                "str" : ["AAA", "123", "123", "ABC", "456"]
            }
        ],[
            ["number[] num"],
            [ "0", "123", "456"],
            {
                "num" : [0, 123, 456]
            }
        ],[
            ["x", "string[] str"],
            [ "AAA", "123", "123", "ABC", "456" ],
            {
                "x":"AAA",
                "str" : ["123", "123", "ABC", "456"]
            }
        ],[
            ["x", "number[] num"],
            [ "0", "123", "456"],
            {
                "x" : "0",
                "num" : [123, 456]
            }
        ],[
            ["string[] str", "string[] x"],
            [ "AAA", "123", "123", "ABC", "456" ],
            {
                "str" : "AAA",
                "x": ["123", "123", "ABC", "456"]
            }
        ],[
            ["number[] num", "number[] x"],
            [ "0", "123", "456"],
            {
                "num" : 0,
                "x": [123, 456]
            }
        ]
    ];
    if(process.argv.length == 2 + 3) {
        test_cases.push([
                "A B C D", null,
                {
                    "A":"AAA",
                    "B":"BBB",
                    "C":"CCC",
                    "D": null
                }]);
        test_cases.push([
                "A B C D", process.argv,
                {
                    "A":"AAA",
                    "B":"BBB",
                    "C":"CCC",
                    "D": null
                }]);
    } else {
        test_cases.push([
                "A B C D", process.argv,
                {
                    "A": null,
                    "B": null,
                    "C": null,
                    "D": null
                }]);
    }
    var test_result = { "pass":0, "fail":0, "log":[] };
    function match(a,b) {
        var result = true;
        Object.keys(a).forEach(function(key) {
            if(!util.isArray(a[key])) {
                if(b[key] !== a[key]) {
                    result = false;
                }
            } else if(!util.isArray(b[key])) {
                result = false;
            } else {
                for(var i = 0; i < a[key].length; i++) {
                    if(a[key][i] !== b[key][i]) {
                        result = false;
                    }
                }
            }
        });
        return result;
    }
    function testHashArg(argdefs, argv, answer) {
        var result = true;
        var args = HashArg.get(argdefs, argv);
        if(!match(answer, args)) {
            result = false;
        }
        if(!match(args, answer)) {
            result = false;
        }
        test_result.log.push({
            "input": {
                "argdefs"   : argdefs,
                "argv"      : argv
            },
            "correct-answer"    : answer,
            "output"  : args,
            "result"    : result
        });
        if(result) {
            test_result.pass++;
        } else {
            test_result.fail++;
        }
        return result;
    };

    // Run all test case
    test_cases.forEach(function(test_case) {
        testHashArg.apply(null, test_case);
    });
    console.log(JSON.stringify(test_result, null, "  "));
    console.log(
            "test:", (test_result.pass + test_result.fail), ",",
            "pass:", test_result.pass, ",",
            "fail:", test_result.fail);
    if(!test_result.fail > 0) {
        process.exit(0);
    }
    process.exit(1);
}());
