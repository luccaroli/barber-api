import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '../config/upload'

import CreateUserService from '../services/CreateUserService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'

const usersRouter = Router()
const upload = multer(uploadConfig)

usersRouter.post('/', async(request, response) => {
    const { name, email, password } = request.body

    const CreateUser = new CreateUserService()

    const user = await CreateUser.execute({
      name,
      email,
      password,
    })

    user.password = ""
    
    return response.json(user)
})

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
    const UpdateUserAvatar = new UpdateUserAvatarService()

    const user = await UpdateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename
    })

    user.password = ""
    
    return response.json(user)
})

export default usersRouter