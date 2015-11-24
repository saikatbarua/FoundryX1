
var foApp = angular.module('foApp', []);

(function (app, fo, undefined) {
    app.controller('workspaceController', function () {

        this.title = 'Foundry Version ' + fo.version;
        this.spike = 'makeLink';

        var spec = {
            myGuid: function myGuid() {
                return this.myName + '::' + fo.tools.generateUUID();
            }
        }

        var model = {};

        var steve = fo.makeNode(spec).setMyName('steve', model);
        var debra = fo.makeNode(spec).setMyName('debra', model);

        var rel = fo.establishLink(steve, 'has Wife|has Husband', debra);

        var strongs = {};

        var steve = fo.makeNode(spec).setMyName('steve', strongs);
        var stu = fo.makeNode(spec).setMyName('stu', strongs);
        var don = fo.makeNode(spec).setMyName('don', strongs);

        fo.establishLink(steve, 'brother|brother', stu);
        fo.establishLink(steve, 'brother|brother', don);
        fo.establishLink(stu, 'brother|brother', don);

        var boxes = {};

        var b1 = fo.makeNode(spec).setMyName('box1', boxes);
        var b2 = fo.makeNode(spec).setMyName('box2', boxes);
        fo.establishSnap(b1, 'toLeftof|toRightOf', b2);



        this.answer1 = fo.tools.stringify(model, undefined, 3);
        this.answer2 = fo.tools.stringify(strongs, undefined, 3);
        this.answer3 = fo.tools.stringify(boxes, undefined, 3);

    });

}(foApp, Foundry));