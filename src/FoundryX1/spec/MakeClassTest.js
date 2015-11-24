/// <reference path="../Scripts/jasmine-1.3.1/jasmine.js" />

/// <reference path="../Foundry/Foundry.trace.js" />
/// <reference path="../Foundry/Foundry.core.js" />
/// <reference path="../Foundry/Foundry.rules.factory.js" />
/// <reference path="../Foundry/Foundry.adaptor.js" />

describe("Foundry: Make Class", function () {



    fo.establishType('bbb::PersonX', {
        lastName: "last",
        firstName: "first",
        genderCode: "U",
        fullName: function () {
            return this.firstName + " " + this.lastName;
        }
    });



    beforeEach(function () {
    });

    //http://wildlyinaccurate.com/understanding-javascript-inheritanc        /// <summary>
    /// 
    /// </summary>

    it("should define a class constructor", function () {
        var func = fo.classConstructorFromSpec('bbb::PersonX');
        expect(func).toBeDefined();
    });

    it("should be able to construct an instance", function () {
        var person = fo.bbb.newInstancePersonX({
            lastName: "strong",
            firstName: "steve",
        });
        expect(person.lastName).toBe("strong");
        expect(person.firstName).toBe("steve");
        expect(person.genderCode).toBe("U");
    });

 
    //it("should be able to compute a method", function () {
    //    var person = fo.bbb.newInstancePersonX({
    //        lastName: "strong",
    //        firstName: "steve",
    //    });
    //    expect(person.$methods.fullName.call(person)).toBe("steve strong");
    //});

    it("should be able to compute using a getter on an method name", function () {
        var person = fo.bbb.newInstancePersonX({
            lastName: "strong",
            firstName: "steve",
        });
        expect(person.fullName).toBe("steve strong");
    });

    //it("should be able to set base value compute a method", function () {
    //    var person = fo.bbb.newInstancePersonX({
    //    });

    //    expect(person.lastName).toBe("last");
    //    expect(person.firstName).toBe("first");

        
    //    person.lastName = "strong";
    //    person.firstName = "steve";
    //    expect(person.$methods.fullName()).toBe("steve strong");
    //});


    it("should be able to set base value using a getter on an method name", function () {
        var person = fo.bbb.newInstancePersonX({
        });

        expect(person.lastName).toBe("last");
        expect(person.firstName).toBe("first");


        person.lastName = "strong";
        person.firstName = "steve";
        expect(person.fullName).toBe("steve strong");
    });

});