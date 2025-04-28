import createHttpError from "http-errors";
import { parseSortParams } from '../utils/parseSortParams.js';
import { getContacts, getContactById, createContact, updateContact, deleteContact } from "../services/contacts.js";
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from "../utils/getEnvVar.js";

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;
    const contacts = await getContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
        userId,
    });
    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};

export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await getContactById(contactId, userId);
    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export const createContactController = async (req, res) => {
    const userId = req.user._id;
    const data = await createContact({
        ...req.body,
        userId,
    });

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data,
    });
};

export const patchContactController = async (req, res, ) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const photo = req.file;
    let photoUrl;

    if (photo) {
        if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    if (!photo) {
        throw createHttpError(400, "File upload failed");
    }

    const result = await updateContact(contactId,
        {
            ...req.body,
            photo: photoUrl || req.body.photo,
            userId,
        });

    if (!result) {
        throw(createHttpError(404, "Contact not found"));
    }

    res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result.contact,
    });
};

export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await deleteContact(contactId, userId);
    if (!contact) {
        throw(createHttpError(404, "Contact not found"));
    }

    res.status(204).send();
};
