var chai = require("chai");
var HashArg = require('../lib/index.js');
describe("hash-arg", function() {
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
                { "name": "num", "type": "number[]" },
            ],
            [ "123", "456", "789", "A" ],
            {
                "num" : [123,456,789,"NaN"]
            }
        ],[
            [
                { "name": "str", "type": "string" },
                { "name": "num", "type": "number[]" },
            ],
            [ "AAA", "123", "456", "789", "A" ],
            {
                "str" : "AAA",
                "num" : [123,456,789,"NaN"]
            }
        ],[
            [
                { "name": "str", "type": "string[]" }
            ],
            [ "123", "456", "789", "A" ],
            {
                "str" : ["123","456","789","A"]
            }
        ],[
            [
                { "name": "num", "type": "number" },
                { "name": "str", "type": "string[]" }
            ],
            [ "AAA", "123", "456", "789", "A" ],
            {
                "num" : "NaN",
                "str" : ["123","456","789","A"]
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
            [
                "str:string",
                " num : number ",
                "numstr : string",
                " strnum:number ",
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
            "str:string;num: number; numstr: string ;strnum:number ;  dflstr",
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
            ["str:string[]"],
            [ "AAA", "123", "123", "ABC", "456" ],
            {
                "str" : ["AAA", "123", "123", "ABC", "456"]
            }
        ],[
            ["num: number[]"],
            [ "0", "123", "456"],
            {
                "num" : [0, 123, 456]
            }
        ],[
            'A="";B;C=1234', [/* NO PARAMETER */],
            {
                "A" : "",
                "B" : null,
                "C" : 1234
            }
        ],[
            'C=1234', [/* NO PARAMETER */],
            {
                "C" : 1234
            }
        ],[
            'C:number=1234', [/* NO PARAMETER */],
            {
                "C" : 1234
            }
        ],[
            'C:string=1234', [/* NO PARAMETER */],
            {
                "C" : "1234"
            }
        ],[
            'A:string="ABC"', [/* NO PARAMETER */],
            {
                "A" : "ABC"
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
    function match(a,b) {
        var result = true;
        Object.keys(a).forEach(function(key) {
            if(!Array.isArray(a[key])) {
                if(b[key] !== a[key]) {
                    result = false;
                }
            } else if(!Array.isArray(b[key])) {
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

    // Run all test case
    test_cases.forEach(function(test_case) {
        it(JSON.stringify(test_case[0]), function() {
            var args = HashArg.get(test_case[0], test_case[1]);
            chai.assert.deepEqual(test_case[2], args);
        });
    });
    describe("The array type can be specified for only last argumnent definition", function() {
        describe("C-style type specification", function() {
            it("should throw an error for array type of string", function() {
                try {
                    HashArg.get("string[] str", "string[] x");
                    chai.assert(false);
                } catch(err) {
                    chai.assert(true);
                }
            });
            it("should throw an error for array type of number", function() {
                try {
                    HashArg.get("number[] num", "number[] n");
                    chai.assert(false);
                } catch(err) {
                    chai.assert(true);
                }
            });
        });
        describe("UML-style type specification", function() {
            it("should throw an error for array type of string", function() {
                try {
                    HashArg.get("str:string[]", "x:string[]");
                    chai.assert(false);
                } catch(err) {
                    chai.assert(true);
                }
            });
            it("should throw an error for array type of number", function() {
                try {
                    HashArg.get("num:number[]", "n:number[]");
                    chai.assert(false);
                } catch(err) {
                    chai.assert(true);
                }
            });
        });
    });
});
