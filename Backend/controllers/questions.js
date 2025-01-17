let QuestionModel = require('../models/questions');
let AdModel = require('../models/ad');

module.exports.create = async function (req, res, next) {
    try {
        const { adId } = req.body;

        // Validate adId
        if (!adId || !mongoose.Types.ObjectId.isValid(adId)) {
            return res.status(400).json({ message: 'Invalid adId provided.' });
        }

        let ad = await AdModel.findById(adId);
        if (!ad || !ad.isActive) {
            return res.status(400).json({ message: 'Advertisement is not active or does not exist.' });
        }

        let newQuestion = new QuestionModel(req.body);
        let result = await QuestionModel.create(newQuestion);
        res.json({
            success: true,
            message: 'Question created successfully.',
            data: result
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};


module.exports.list = async function (req, res, next) {
    try {
        let list = await QuestionModel.find({}).populate('adId', 'title');
        res.json(list);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// Perform answer a question - only allowed for ad owners
module.exports.performAnswer = async function (req, res, next) {
    try {
        let qID = req.params.questionID;

        // Find the question by its ID and populate the adId field to get ad details
        let question = await QuestionModel.findById(qID).populate('adId', 'owner');
        if (!question) {
            return res.status(404).json({ message: 'Question not found.' });
        }

        // Check if the authenticated user is the owner of the advertisement related to the question
        if (question.adId.owner.toString() !== req.auth.id) {
            return res.status(403).json({ message: 'You are not authorized to answer this question.' });
        }

        // Proceed to answer the question
        question.answerText = req.body.answerText;
        question.answeredAt = new Date();

        let result = await question.save();
        console.log(result);

        res.json({
            success: true,
            message: 'Question answered successfully.'
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports.get = async function (req, res, next) {
    try {
        let qID = req.params.questionID;
        req.question = await QuestionModel.findOne({ _id: qID }).populate('adId', 'title');
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
};

module.exports.getByID = async function (req, res, next) {
    res.json(req.question);
};

module.exports.remove = async function (req, res, next) {
    try {
        let qID = req.params.questionID;
        let result = await QuestionModel.deleteOne({ _id: qID });
        console.log(result);

        if (result.deletedCount > 0) {
            res.json({
                success: true,
                message: 'Question deleted successfully.'
            });
        } else {
            throw new Error('Question not deleted. Are you sure it exists?');
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// module.exports.getQuestionsByAdId = async function (req, res, next) {
//     const adId = req.params.adId;
//     const questions = await QuestionModel.find({ adId: adId }).populate('adId', 'title');
//     res.json(questions);
//   };

const mongoose = require('mongoose');

module.exports.getQuestionsByAdId = async function (req, res, next) {
    try {
        const adId = req.params.adId;

        // Validate and convert adId to ObjectId
        if (!adId || adId === "undefined" || !mongoose.Types.ObjectId.isValid(adId)) {
            return res.status(400).json({ message: "Invalid adId provided." });
        }

        const questions = await QuestionModel.find({ adId: new mongoose.Types.ObjectId(adId) }).populate('adId', 'title');
        res.json(questions);
    } catch (error) {
        console.error("Error in getQuestionsByAdId:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};



// module.exports.getQuestionsByAdId = async function (req, res, next) {
//     try {
//         const adId = req.params.adId;

//         // Validate adId
//         if (!adId || adId === "undefined") {
//             return res.status(400).json({ message: "Invalid adId provided." });
//         }

//         const questions = await QuestionModel.find({ adId: adId }).populate('adId', 'title');
//         res.json(questions);
//     } catch (error) {
//         console.error("Error in getQuestionsByAdId:", error);
//         next(error);
//     }
// };