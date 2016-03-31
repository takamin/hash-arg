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
    }
    var test_result = { "pass":0, "fail":0, "log":[] };
    function testHashArg(argdefs, argv, answer) {
        var result = true;
        var args = HashArg.get(argdefs, argv);
        Object.keys(answer).forEach(function(key) {
            if(args[key] !== answer[key]) {
                result = false;
            }
        });
        Object.keys(args).forEach(function(key) {
            if(args[key] !== answer[key]) {
                result = false;
            }
        });
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
        process.exit(1);
    }
}());
