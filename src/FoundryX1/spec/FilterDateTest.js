/// <reference path="../Scripts/jasmine-1.3.1/jasmine.js" />

/// <reference path="../Foundry/Foundry.trace.js" />
/// <reference path="../Foundry/FoundryUI.js" />


describe("Filter: a Date", function () {

    var dateArray = [];

    beforeEach(function () {
        dateArray = [];
        var today = new Date();
        for (var i = 1; i < 30; i++){
            dateArray.push({
                daysSinceToday: i,
                theDate: today.addDays(i),
            })
        }

    });

    it("should work if array is empty", function () {
        dateArray = [];
        var results = fo.filtering.applyFilter(dateArray, 'date[2015-01-01:2015-01-03] ')
        expect(results.length).toBe([].length);
    });


    //it("should filter out just today from array", function () {
    //    var today = new Date();
    //    var filter = 'theDate(' + today.toDateString() + ')';

    //    var results = fo.filtering.applyFilter(dateArray, filter)
    //    expect(results.length).toBe(1);

    //    var item = results[0];
    //    expect(item.daysSinceToday).toBe(0);
    //    expect(item.theDate).toBe(today);


    //});

 
});