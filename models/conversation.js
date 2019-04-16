import mongoose, { SchemaTypes } from 'mongoose';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';
// import UUIDV4 from 'uuid/v4';

const Conversation = new Schema({
    //   _id: { type: String, required: true, default: UUIDV4 },
      parties:[
            { 
                type: SchemaTypes.ObjectId, 
                ref: 'accounts'
            },
        ],
      messages: [
        {
          type: SchemaTypes.ObjectId,
          required: true,
          ref: 'messages'
        }
      ]
}, {
    timestamps: true
});

Conversation.plugin(passportLocalMongoose);

export default mongoose.model('conversations', Conversation);
