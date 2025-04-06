import { Router } from "express";
import { getContacts, getContactById } from "../services/contacts";

const router = Router();

router.get("/contacts", async (req, res) => {
        const data = await getContacts();

        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data,
        });
    });

    router.get("/contacts/:contactId", async (req, res) => {
            const { contactId } = req.params;

            const data = await getContactById(contactId);
            if (!data) {
                return res.status(404).json({
                    status: 404,
                    message: 'Contact not found',
                });
            }
            res.json({
                status: 200,
                message: `Successfully found contact with id ${contactId}!`,
                data,
            });

        });

export default router;

