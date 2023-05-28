import joi from "joi";

export const postsSchema = joi.object({
    image: joi.string().uri().required(),
    postDescription: joi.string().required()
});