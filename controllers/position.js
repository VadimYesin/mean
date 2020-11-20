const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');

module.exports.create = async function (req, res) {
    try {
        const position = await new Position({
            name: req.body.name,
            cost: req.body.cost,
            category: req.body.category,
            user: req.user.id
        }).save();
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.remove = async function (req, res) {
    try {
        await Position.remove({_id: req.params.id});
        res.status(200).json({
            message: `Position #${req.params.id} was deleted!`
        });
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.update = async function (req, res) {
    try {
        const position = await Position.findOneAndUpdate(
            {_id: req.params.id}, // find position by id
            {$set: req.body}, // update position to these params
            {new: true} // returns after updating position
            );
        res.status(200).json(position);
    } catch (e) {
        errorHandler(res, e);
    }
}

module.exports.getByCategoryId = async function (req, res) {
    try {
        const positions = await Position.find({
            category: req.params.categoryId,
            user: req.user.id
        });
        res.status(200).json({positions});
    } catch (e) {
        errorHandler(res, e);
    }
}