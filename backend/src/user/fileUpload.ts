import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";

export default async function fileUploadController(req: Request, res: Response) {
    const { image } = req.body;

    const uploadResponse = await cloudinary.uploader.upload(image, {
        resource_type: 'image'
    });

    console.log('Cloudinary upload result:', uploadResponse);
}