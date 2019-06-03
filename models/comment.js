const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ret: 'User'
        },
        username: String 
    }
});
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;