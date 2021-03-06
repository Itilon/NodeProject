const { ObjectID } = require('mongodb');

class BaseData {
    constructor(db, modelClass, validator) {
        this.db = db;
        this.modelClass = modelClass;
        this.validator = validator;
        this.collectionName = this._getCollectionName();
        this.collection = this.db.collection(this.collectionName);
    }

    filterBy(props) {
        return this.collection.find(props)
            .toArray();
    }

    findById(id) {
        return this.collection.findOne({
            _id: new ObjectID(id),
        });
    }

    findByName(name) {
        return this.collection.findOne({
            name: name,
        });
    }

    getAll() {
        const filter = {};
        const options = {};
        return this.collection.find(filter, options)
            .toArray();
    }

    getSome(number) {
        const filter = {};
        const options = {};
        return this.collection.find(filter, options)
            .sort({ _id: -1 })
            .limit(number)
            .toArray();
    }

    create(model) {
        // if (!this._isModelValid(model)) {
        //     return Promise.reject('Invalid model');
        // }
        return this.collection.insert(model);
    }

    deleteById(id) {
        // eslint-disable-next-line new-cap
        return this.collection.remove({ _id: ObjectID(id) });
    }

    pullById(userId, id) {
        return this.collection
            .updateOne({ _id: userId },
            // eslint-disable-next-line new-cap
            { $pull: { posts: { _id: ObjectID(id) } } });
    }

    _getCollectionName() {
        return this.modelClass.name.toLowerCase() + 's';
    }

    _isModelValid(model) {
        if (typeof this.validator === 'undefined' ||
            typeof this.validator.isValid !== 'function') {
            return true;
        }

        return this.validator.isValid(model);
    }
}
module.exports = BaseData;
