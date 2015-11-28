var foApp = angular.module('foApp', []);

(function (app, fo, tools, ops, db, undefined) {

    var labItem = fo.establishType('fo::labItem', {
        appUrl: '',
        imageUrl: 'images/labs/Labs1_150x150.png',
        title: "experiments",
        appGroup: '0:lab',
    });

    var labGroupDB = db.getEntityDB('fo::labGroup');
    labGroupDB.idFunction = function (item) {
        return item.groupName;
    }

    var labGroup = fo.establishType('fo::labGroup', {
        groupName: '',
        isCollapsed: false,
    });

    app.controller('workspaceController', function ($rootScope) {

        self = this;

        self.restoreSession = function () {
            db.restoreAllEntityDB(labGroupDB.myName, 'indexPage');
        }


        self.saveSession = function () {
            db.saveAllEntityDB(labGroupDB.myName, 'indexPage');
        }

        self.toggleIsCollapsed = function (group) {
            group.isCollapsed = !group.isCollapsed;

            self.saveSession();
            $rootScope.$apply();
        }

        self.restoreSession();


        var appJSON = [
        {
            appUrl: 'indexParisAttacks.html',
            imageUrl: 'images/labs/Labs10_150x150.png',
            title: "Paris",
            appGroup: '01:applications',
        },
        {
            appUrl: 'indexflightleg.html',
            imageUrl: 'images/labs/Labs10_150x150.png',
            title: "Flight Leg",
            appGroup: '01:applications',
        },
        {
            appUrl: 'indexflights.html',
            imageUrl: 'images/labs/Labs10_150x150.png',
            title: "Flights",
            appGroup: '01:applications',
        },
        {
            appUrl: 'indexCountries.html',
            imageUrl: 'images/labs/Labs10_150x150.png',
            title: "Countries",
            appGroup: '01:applications',
        },
        {
            appUrl: 'index3DModel.html',
            imageUrl: 'images/labs/Labs10_150x150.png',
            title: "3D",
            appGroup: '01:applications',
        },
        {
            appUrl: 'indexParticle.html',
            imageUrl: 'images/labs/Labs10_150x150.png',
            title: "Particle",
            appGroup: '01:applications',
        },
        {
            appUrl: 'indexthree.html',
            imageUrl: 'images/labs/Labs10_150x150.png',
            title: "Three",
            appGroup: '01:applications',
        },
        {
            appUrl: 'indexCAD.html',
            imageUrl: 'images/labs/Labs10_150x150.png',
            title: "CAD",
            appGroup: '01:applications',
        },

          {
              appUrl: 'foundryspec/testrunner.html',
              imageUrl: 'images/labs/Labs12_150x150.png',
              title: "jasmine",
              appGroup: '02:testing',
          },
           {
               appUrl: 'foundryspec/spike-entitydb.html',
               imageUrl: 'images/labs/Labs12_150x150.png',
               title: "spike-entitydb",
               appGroup: '02:testing',
           },
          {
              appUrl: 'foundryspec/spike-factory.html',
              imageUrl: 'images/labs/Labs12_150x150.png',
              title: "spike-factory",
              appGroup: '02:testing',
          },
          {
              appUrl: 'foundryspec/spike-makecomponent.html',
              imageUrl: 'images/labs/Labs12_150x150.png',
              title: "spike-makecomponent",
              appGroup: '02:testing',
          },
          {
              appUrl: 'foundryspec/spike-makedto.html',
              imageUrl: 'images/labs/Labs12_150x150.png',
              title: "spike-makedto",
              appGroup: '02:testing',
          },
          {
              appUrl: 'foundryspec/spike-makelink.html',
              imageUrl: 'images/labs/Labs12_150x150.png',
              title: "spike-makelink",
              appGroup: '02:testing',
          },
          {
              appUrl: 'foundryspec/spike-makelink.html',
              imageUrl: 'images/labs/Labs12_150x150.png',
              title: "spike-makelink",
              appGroup: '02:testing',
          },
          {
              appUrl: 'foundryspec/spike-makenetwork.html',
              imageUrl: 'images/labs/Labs12_150x150.png',
              title: "spike-makenetwork",
              appGroup: '02:testing',
          },
          {
              appUrl: 'foundryspec/spike-makenetwork.html',
              imageUrl: 'images/labs/Labs12_150x150.png',
              title: "spike-makenetwork",
              appGroup: '02:testing',
          },
          {
              appUrl: 'foundryspec/spike-makenode.html',
              imageUrl: 'images/labs/Labs12_150x150.png',
              title: "spike-makenode",
              appGroup: '02:testing',
          },

          {
              appUrl: 'foundryspec/spike-meta.html',
              imageUrl: 'images/labs/Labs12_150x150.png',
              title: "spike-meta",
              appGroup: '02:testing',
          },
          {
              appUrl: 'foundryspec/spike-makeworkspace.html',
              imageUrl: 'images/labs/Labs12_150x150.png',
              title: "spike-makeworkspace",
              appGroup: '02:testing',
          },



            //{
            //    appUrl: 'foundryspec/spike-typeview.html',
            //    imageUrl: 'images/labs/Labs9_150x150.png',
            //    title: "object definitions",
            //    appGroup: '03:ONTOLOGY',
            //},
            {
                appUrl: 'ontologyView.html',
                imageUrl: 'images/labs/Labs9_150x150.png',
                title: "all ontologies",
                appGroup: '03:ONTOLOGY',
            },
        ];



        var sortedList = ops.applySort(appJSON, 'appGroup(a);title(a)')

        var items = sortedList.map(function (item) {
            return labItem.newInstance(item);
        });

        var sets = ops.applyGrouping(items, 'appGroup');
        var groups = tools.mapOverKeyValue(sets, function (key, value) {
            var found = labGroupDB.getItem(key);
            if (!found) {
                found = labGroupDB.newInstance({ groupName: key }, value);
            } else if ( value.length != found.subcomponents.length ) {
                found.establishSubcomponents(value, true);
            }
            return found;
        });


        self.groups = groups;

    });

}(foApp, Foundry, Foundry.tools, Foundry.listOps, Foundry.db));