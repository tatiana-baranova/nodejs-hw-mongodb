import { model, Schema } from 'mongoose';

const sessionsSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        accessTokenValidUtil: { type: Date, required: true },
        refreshTokenValidUtil: { type: Date, required: true },
    },
    { timestamps: true, versionKey: false },
);

export const SessionsCollection = model('sessions', sessionsSchema);
