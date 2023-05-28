import { postsSchema } from "../schemas/post.schema.js";

export default async function postValidation (req, res, next){

    const validation = postsSchema.validate(req.body, { abortEarly: false});
    
    if (validation.error) {
        const erros = validation.error.details.map(detail => detail.message);
        return res.status(422).send(erros);
    }

    next()
}