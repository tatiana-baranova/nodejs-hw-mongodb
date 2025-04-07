import {ContactCollection} from '../db/models/Contact.js';

export const getContacts = () => ContactCollection.find();
export const getContactById = id => ContactCollection.findOne({ _id: id });
export const createContact = payload => ContactCollection.create(payload);
export const updateContact = async (_id, payload, options = {}) => {
    const { upsert = false } = options;
    const rawResult = await ContactCollection.findOneAndUpdate({ _id }, payload, {
        new: true,
        upsert,
        includeResultMetadata: true,
    });
    if (!rawResult || !rawResult.value) return null;
    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};
