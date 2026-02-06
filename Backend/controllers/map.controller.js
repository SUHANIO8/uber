const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res, next) => {
    console.log('[getCoordinates] req.query =', req.query);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('[getCoordinates] validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        console.error('getCoordinates Error:', error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports.getDistanceTime = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        const distanceTime = await mapService.getDistanceTime(origin, destination);

        res.status(200).json(distanceTime);
    } catch (err) {
        console.error('getDistanceTime Error:', err.message);
        res.status(400).json({ message: err.message });
    }
};

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    try {
        console.log('[getAutoCompleteSuggestions] req.query =', req.query);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('[getAutoCompleteSuggestions] validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { input } = req.query;

        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (err) {
        console.error('getAutoCompleteSuggestions Error:', err.message);
        res.status(400).json({ message: err.message });
    }
};