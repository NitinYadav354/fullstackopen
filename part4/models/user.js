const { uniq } = require('lodash');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username:
        {
            type: String,
            required: true,
            unique: true
        },
        passwordHash:         {
            type: String,
            required: true
        },
        name: String,
        
    },
    { autoIndex: true }
)

userSchema.set('toJSON', {
    transform : (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User