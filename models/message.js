import mongoose, { SchemaTypes } from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';
// import UUIDV4 from 'uuid/v4';

const Message = new Schema({
    // _id: { type: String, required: true, default: UUIDV4 },
    sender: {type: SchemaTypes.ObjectId, required: true, ref: 'accounts'},
    to:{type: SchemaTypes.ObjectId, required: true, ref: 'accounts'},
    conversationId: {type: SchemaTypes.ObjectId, required: true, ref: 'conversations'},
    body: String,
}, {
    timestamps: true
});

Message.plugin(passportLocalMongoose);

export default mongoose.model('messages', Message);

