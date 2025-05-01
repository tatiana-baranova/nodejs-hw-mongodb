import {ContactCollection} from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = 'name',
    filter = {},
    userId,
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactCollection.find({ userId });

    if (filter.type) {
        contactsQuery.where('contactType').equals(filter.type);
    }

    if (filter.isFavourite !== undefined) {
        contactsQuery.where('isFavourite').equals(filter.isFavourite);
    }

    const [contactsCount, contacts] = await Promise.all([
        ContactCollection.countDocuments({ userId }),
        contactsQuery.skip(skip).limit(limit).sort({ [sortBy]: sortOrder }).exec(),
    ]);

    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    return {
        data: contacts,
        ...paginationData,
    };
};

export const getContactById = (id, userId) => ContactCollection.findOne({ _id: id, userId });
export const createContact = payload => ContactCollection.create(payload);


export const updateContact = async (contactIdAndUserId, payload, options = {}) => {
    const rawResult = await ContactCollection.findOneAndUpdate(
        contactIdAndUserId,
        payload,
        {
            new: true,
            ...options
        }
    );
    if (!rawResult) return null;
    return {
        rawResult,
    };
};

export const deleteContact = (id, userId) => ContactCollection.findOneAndDelete({ _id: id, userId });
