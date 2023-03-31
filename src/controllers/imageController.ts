import { Request, Response } from 'express';
import { productsAPI } from '../apis/productsAPI';

class ImageController {
  async getImages(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ msg: 'missing parameters' });
      const producto = await productsAPI.getProducts(id);
      if (!producto) res.status(404).json({ msg: `product not found` });
      return res.status(200).json(producto[0].images);
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  }

  async deleteImage(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const image = req.body.image;
      if (!id || !image) return res.status(400).json({ msg: 'missing parameters' });
      const producto = await productsAPI.getProducts(id);
      if (!producto) res.status(404).json({ msg: `product not found` });
      const index = producto[0].images.indexOf(image);
      if (index > -1) {
        producto[0].images.splice(index, 1);
        await productsAPI.updateProduct(id, producto[0]);
        return res.status(200).json({ msg: 'image deleted', data: producto[0].images });
      }
      return res.status(404).json({ msg: 'image not found' });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  }

  async uploadImage(req: Request, res: Response) {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ msg: 'missing parameters' });
      const producto = await productsAPI.getProducts(id);
      if (!producto) res.status(404).json({ msg: `product not found` });
      const newImageArray = [...producto[0].images, req.body.image];
      const updatedItem = await productsAPI.updateProduct(id, { images: newImageArray });
      res.status(201).json({
        msg: 'añadiendo imagen',
        data: updatedItem.images
      });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  }
}

export const imageController = new ImageController();
