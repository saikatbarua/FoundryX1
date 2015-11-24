/// <reference path="../Scripts/jasmine-1.3.1/jasmine.js" />

/// <reference path="../Foundry/Foundry.trace.js" />
/// <reference path="../Foundry/Foundry.core.js" />
/// <reference path="../Foundry/Foundry.rules.factory.js" />

describe("Foundry: Subcomponents Create", function () {


    //var space = workspaceService.activeWorkSpace();
    //var factory = app.createType();

    //dataSources = factory.newDataSourceViewModel();

    //var events = factory.newEventData();
    //dataSources.capture(events);
    //events.capture(factory.newTsdbEventIdDataSource());

    //var locations = factory.newLocationData();
    //dataSources.capture(locations);
    //locations.capture(factory.newTsdbLocationDataSource());
    //locations.capture(factory.newNuclearDataSource());




    beforeEach(function () {
        fo.establishType('aaa::person', {
            id: '',
            dateTime: new Date(),
            data: 'x',
        });

        fo.establishType('aaa::struct', {
            id: '',
            dateTime: new Date(),
            data: 'y',
        });

        fo.meta.establishMetadata('aaa::struct', {
            id : { name: 'Id', type: 'int' }
        });

        for (var i = 0; i < 1000; i++) {
            var person = fo.aaa.establishPerson({
                id: i,
                data: 'A' + i,
            }, function (item) { return item.id; })
        }

    });




    it("make instance with subcomponents and check values", function () {
        var struct = fo.aaa.makeStruct({}, [
            fo.aaa.makeStruct({ data: 'A' }),
              fo.aaa.makeStruct({ data: 'B' }),
                fo.aaa.makeStruct({ data: 'C' }),
                  fo.aaa.makeStruct({ data: 'D' }),
                    fo.aaa.makeStruct({ data: 'E' }),
        ]);
        expect(struct.isOfType('struct')).toBe(true);
        expect(struct.data.matches('y')).toBe(true);
        expect(struct.Subcomponents.count).toBe(5);
        expect(struct.Subcomponents.item(2).data).toBe('C');

    });

    it("should be able to create components with subcomponent instances", function () {
        var child = fo.makeComponent({ myName: 'steve' });
        expect(fo.utils.isaComponent(child)).toBe(true);

        var parent = fo.makeComponent({ myName: 'strong' }, [child]);
        expect(fo.utils.isaComponent(parent)).toBe(true);

        expect(parent.Properties.isEmpty()).toBe(true);
        expect(parent.Subcomponents.count).toBe(1);
    });

    it("create instance and check values", function () {
        var person = fo.aaa.newPerson();
        expect(person.isOfType('Person')).toBe(true);
        expect(person.data.matches('x')).toBe(true);
    });

    it("create 1000 unique items in the dictionary", function () {


        var items = fo.getEntityDictionaryLookup('aaa::person')
        var keys = Object.keys(items);

        expect(keys.length).toBe(1000);
    });


    it("should be able to grab one of these items from dictionary", function () {
        var items = fo.getEntityDictionaryLookup('aaa::person');
        var item = items[500];

        expect(item.data).toBe('A'+500);
    });

    it("should be able unload dictionary items based on list", function () {
        var idList = []; 
        for (var i = 500; i < 1000; i++) {
            idList.push(i);
        }

        var deletedItems = fo.unloadDictionary('aaa::person', idList);

        var items = fo.getEntityDictionaryLookup('aaa::person');
        var keys = Object.keys(items);

        expect(keys.length).toBe(500);
    });

    it("should be able filter dictionary items", function () {

        var filter = 'id[100:199]'

        try {
            var filteredItems = fo.filterDictionary('aaa::person', filter);
            expect(filteredItems.length).toBe(100);
        }
        catch (ex) { }

    });

    it("should be able sort dictionary items", function () {

        var sort = 'data(d)'

        try {
            var sortedItems = fo.sortDictionary('aaa::person', sort);

            expect(sortedItems.length).toBe(1000);
            expect(sortedItems[0].data).toBe('A999');
        }
        catch (ex) { }
    });

    it("should be able get meta data dictionary keys", function () {

        var keys = fo.metadataDictionaryKeys();
        var found = keys.indexOf('aaa::struct');

        expect(found > -1).toBe(true);
    });

    it("should be able get meta data item by matching property", function () {

        var found = fo.metadataDictionaryKeysWhere(function (item) {
            var result = item.hasOwnProperty('id');
            return result;
        });

        expect(found[0]).toBeDefined();
    });

    it("should be able get type dictionary keys", function () {

        var keys = fo.typeDictionaryKeys();
        var found = keys.indexOf('aaa::person');

        expect(found > -1).toBe(true);
    });


    it("should be able get type item by matching property", function () {

        var found = fo.typeDictionaryKeysWhere(function (item) {
            var result = item.hasOwnProperty('data');
            return result;
        });

        expect(found[0]).toBeDefined();
    });


    it("should be able get entity dictionary keys", function () {

        var keys = fo.entityDictionariesKeys();
        var found = keys.indexOf( 'aaa::person');

       expect(found > -1).toBe(true);
    });
 
});