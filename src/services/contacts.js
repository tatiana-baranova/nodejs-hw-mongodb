import {ContactCollection} from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({ page, perPage }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactCollection.find();
    const contactsCount = await ContactCollection.countDocuments();

    const contacts = await contactsQuery.skip(skip).limit(limit).exec();

    const paginationData = calculatePaginationData(contacts,contactsCount, perPage, page);

    return paginationData;
};
    // => ContactCollection.find();




export const getContactById = id => ContactCollection.findOne({ _id: id });
export const createContact = payload => ContactCollection.create(payload);
export const updateContact = async (_id, payload, options = {}) => {
    const { upsert } = options;
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

export const deleteContact = id => ContactCollection.findOneAndDelete({ _id: id });
