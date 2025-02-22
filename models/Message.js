const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    author: {type: String, require: true},
    username:{type: String, require: true},
    title: {type: String, require: true},
    message: {type: String, require: true},
    createAt: {type: Date, default: Date.now}
})

let Message = mongoose.model('Message', messageSchema);

module.exports = Message

module.exports.saveMessage = (data) => {
    const message = new Message(data)
    return message.save()
    .then(() => {
        console.log("Message saved successfully!")
    })
    .catch((err) => {
        console.error("Error saving message:", err);
    })
}