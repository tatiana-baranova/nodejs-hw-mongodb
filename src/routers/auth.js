import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUsersSchema, loginUsersSchema, loginWithGoogleOAuthSchema } from '../validation/auth.js';
import { registerUserController, loginUserController, logoutUserController, refreshUserSessionController, loginWithGoogleController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { requestResetEmailController } from '../controllers/auth.js';
import { requestResetEmailSchema } from '../validation/auth.js';
import { resetPasswordController } from '../controllers/auth.js';
import { resetPasswordSchema } from '../validation/auth.js';
import { getGoogleOAuthUrlController } from '../controllers/auth.js';

const router = Router();

router.post('/register',
    validateBody(registerUsersSchema),
    ctrlWrapper(registerUserController),
);

router.post(
    '/login',
    validateBody(loginUsersSchema),
    ctrlWrapper(loginUserController),
);

router.post('/send-reset-email',
    validateBody(requestResetEmailSchema),
    ctrlWrapper(requestResetEmailController),
);

router.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController),);

router.post('/logout', ctrlWrapper(logoutUserController));
router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));
router.post('/confirm-oauth', validateBody(loginWithGoogleOAuthSchema),
    ctrlWrapper(loginWithGoogleController),
);
export default router;
