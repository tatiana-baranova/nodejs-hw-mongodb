import createHttpError from "http-errors";
import { ContactCollection } from "../db/models/Contact.js";
import { ROLES } from "../constants/index.js";

export const checkRoles = (...roles) => async (req, res, next) => {
    const { user } = req;
    if (!user) {
        next(createHttpError(401));
        return;
    }

    const { role } = user;
    if (roles.includes(ROLES.USERS) && role === ROLES.USERS) {
        next();
        return;
    }

    if (roles.includes(ROLES.CONTACTS) && role === ROLES.CONTACTS) {
        const { contactId } = req.params;
        if (!contactId) {
            next(createHttpError(403));
            return;
        }

        const contact = await ContactCollection.findOne({
            id: contactId,
            userId: user._id,
        });

        if (contact) {
            next();
            return;
        }
    }
    next(createHttpError(403));
};
