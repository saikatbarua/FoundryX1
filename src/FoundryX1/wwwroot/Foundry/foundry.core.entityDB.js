var Foundry = Foundry || {};
Foundry.tools = Foundry.tools || {};
Foundry.db = Foundry.db || {};
Foundry.listOps = Foundry.listOps || {};

(function (ns, tools, listOps, undefined) {

    //in prep for prototype pattern...
    var EntityDB = function (properties, subcomponents, parent) {
        //"use strict";

        this.base = ns.Component ? ns.Component : ns.Node;
        this.base(properties, subcomponents, parent);


        this.myName = properties && properties.myName || undefined;
        this.myParent = parent;
        this.myType = 'EntityDB';


        this.idFunction = function (item) {
            return item.id;
        }

        this.newInstance = function (mixin, subcomponents, parent, id) {
            var result = this.defaultType.newInstance(mixin, subcomponents, parent)
            var key = id || this.idFunction(mixin);
            key && this.setItem(key, result);
            return result;
        }

        this.modifyOrCreateInstance = function (mixin, subcomponents, parent, id) {
            var key = id || this.idFunction(mixin);
            var found = this.getItem(key);
            if (!found) {
                found = this.defaultType.newInstance(mixin, subcomponents, parent);
                key = key || found.asReference(); //force guid to be created
                this.setItem(key, found);
            } else {
                tools.mixin(found, mixin);
            }
            return found;
        }


        this.establishInstance = function (mixin, id, onCreate) {
            var result = this.modifyOrCreateInstance(mixin, [], undefined, id, onCreate);
            onCreate && onCreate(result)
            return result;
        }

        this.findInstance = function (id, onFound) {
            var found = this.lookup[id];
            found && onFound && onFound(found);
            return found;
        }



        return this;
    }

    EntityDB.prototype = (function () {
        var anonymous = function () { this.constructor = EntityDB; };
        anonymous.prototype = ns.Component ? ns.Component.prototype : ns.Node.prototype;
        return new anonymous();
    })();

    ns.EntityDB = EntityDB;
    ns.makeEntityDB = function (id, subcomponents, parent) {

        var dictionarySpec = {
            myName: id,
            namespace: function () {
                var list = this.myName.split('::');
                return list[0]
            },
            name: function () {
                var list = this.myName.toUpperCase().split('::');
                return list.length > 1 ? list[1] : list[0];
            },
            entries: {},
            keys: function () {
                return Object.keys(this.entries);
            },
            count: function () {
                return this.keys.length;
            },
            items: function () {
                this.count;
                var result = this.asArray();
                return result;
            },
            lookup: function () {
                this.count;
                var result = this.entries;
                return result;
            },
            filter: '',
            filteredItems: function () {
                var result = listOps.applyFilter(this.items, this.filter);
                return result;
            },
            filteredCount: function () {
                return this.filteredItems.length;
            },
            meta: function () {
                return fo.meta.findMetadata(this.myName);
            },
            defaultType: function () {
                return fo.establishType(this.myName);
            },
        };

        return new ns.EntityDB(dictionarySpec, subcomponents, parent);
    };


    //Prototype defines functions using JSON syntax
    tools.mixin(EntityDB.prototype, {
        asArray: function (funct) {
            funct = funct ? funct : function (item) { return item; }
            var list = tools.mapOverKeyValue(this.entries, function (key, value) {
                return funct(value);
            });

            return list;
        },
        purge: function (x) {
        },
        getItem: function (id) {
            return this.entries[id];
        },
        setItem: function (id, item) {
            //if (item.myType != obj.myName) {
            //    alert('problems');
            //}
            this.smashProperty('keys');
            this.entries[id] = item;
            return item;
        },

        removeItem: function (id) {
            this.smashProperty('keys');
            var result = this.entries[id];
            this.entries[id] = undefined;
            return result;
        },

        forEachMember: function (funct) {
            this.items.forEach(funct);
        },

        forEachKeyValueMember: function (funct) {
            tools.forEachKeyValue( this.entries, funct);
        },
    });


}(Foundry, Foundry.tools, Foundry.listOps));


(function (ns, db, tools, undefined) {

    var _dictionaries = {};
    function establishDictionary(specId) {
        var found = _dictionaries[specId];
        if (!found) {
            _dictionaries[specId] = ns.makeEntityDB(specId);
            found = _dictionaries[specId];
        }
        return found;
    }

    db.getEntityDB = function (specId) {
        if (!ns.isValidNamespaceKey(specId)) return;
        return establishDictionary(specId)
    }

    db.getEntityDBAsArray = function (specId) {
        var dict = db.getEntityDB(specId);
        return dict.items;
    }

    db.getEntityDBLookup = function (specId) {
        var dict = db.getEntityDB(specId);
        return dict.lookup;
    }

    db.getEntityDBMeta = function (specId) {
        var dict = db.getEntityDB(specId);
        return dict.meta;
    }

    db.getEntityDBKeys = function (specId) {
        var dict = db.getEntityDB(specId);
        return Object.keys(dict.lookup);
    }


    db.entityDBKeys = function () {
        return Object.keys(_dictionaries);
    }

    db.entityDBWhere = function (func) {
        var result = tools.applyOverKeyValue(_dictionaries, function (key, value) {
            return !func || func(key, value) ? value : undefined;
        });
        return result;
    }



    db.saveAllEntityDB = function (specId, storageKey, dehydrate) {
        var lookup = db.getEntityDBLookup(specId);

        if (localStorage) {
            dehydrate = dehydrate ? dehydrate : function (item) {
                return item.getSpec ? item.getSpec() : item;
            };

            var objects = ns.tools.mapOverKeyValue(lookup, function (key, value) {
                if (value) {
                    var result = dehydrate(value);
                    return result;
                }
            });

            var payload = tools.stringify(objects); //JSON.stringify(objects);
            localStorage.setItem(storageKey || specId, payload);
            return true;
        }
    }

    db.restoreAllEntityDB = function (specId, storageKey, hydrate) {
        if (!ns.isValidNamespaceKey(specId)) return;
        if (localStorage) {
            var entityDB = db.getEntityDB(specId);
            hydrate = hydrate ? hydrate : function (item) {
                return entityDB.establishInstance(item);
            };

            var payload = localStorage.getItem(storageKey || specId) || '[]';

            var objects = JSON.parse(payload);
            objects.forEach(hydrate);

            return true;
        }
    }

    db.deleteEntityDB = function (specId) {
        if (!ns.isValidNamespaceKey(specId)) return;

        var found = _dictionaries[specId];
        if (found) {  //drop references to help GC
            found.purge();
        }

        delete _dictionaries[specId];
    }

    db.unloadEntityDB = function (specId, idList) {
        if (!ns.isValidNamespaceKey(specId)) return;
        var results = [];
        var found = _dictionaries[specId];
        if (!found) return results;

        idList = idList || [];
        idList.forEach(function (id) {
            results.push(found.removeItem(id));
        });

        found.reset()
        return results;
    }




}(Foundry, Foundry.db, Foundry.tools));