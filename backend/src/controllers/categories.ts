
import { Request, Response } from 'express';
import Category from '../models/Category';
import slugify from 'slugify';

const categoryController = {
  // Get all categories
  async getAllCategories(req: Request, res: Response) {
    try {
      const { page = '1', limit = '10', search, sort = 'name' } = req.query as Record<string, string>;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      let query: any = { isActive: true };
      if (search) {
        query = {
          ...query,
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        };
      }

      const categories = await Category.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum);

      const total = await Category.countDocuments(query);

      return res.json({
        success: true,
        categories,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      });
    } catch (error:any) {
      console.error('Get categories error:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Get category by ID
  async getCategoryById(req: Request, res: Response) {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      return res.json(category);
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get category by slug
  async getCategoryBySlug(req: Request, res: Response) {
    try {
      const category = await Category.findOne({ slug: req.params.slug });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      return res.json(category);
    } catch (error:any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Create new category
  async createCategory(req: Request, res: Response) {
    try {
      const { name, description, image } = req.body;

      // Check if category with same name exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ 
          success: false,
          message: 'Category with this name already exists' 
        });
      }

      // Generate slug
      const slug = slugify(name, { lower: true, strict: true });

      const category = new Category({
        name,
        slug,
        description,
        image: image || 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400',
        isActive: true,
        sortOrder: 0
      });

      await category.save();

      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category }
      });
    } catch (error: any) {
      return res.status(500).json({ 
        success: false,
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Update category
  async updateCategory(req: Request, res: Response) {
    try {
      const { name, description, image } = req.body;
      const categoryId = req.params.id;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ 
          success: false,
          message: 'Category not found' 
        });
      }

      // Check if user has permission to update
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied' 
        });
      }

      // Update fields
      if (name) {
        category.name = name;
        category.slug = slugify(name, { lower: true, strict: true });
      }
      if (description !== undefined) category.description = description;
      if (image !== undefined) category.image = image;

      await category.save();

      return res.json({
        success: true,
        message: 'Category updated successfully',
        data: { category }
      });
    } catch (error: any) {
      return res.status(500).json({ 
        success: false,
        message: 'Server error', 
        error: error.message 
      });
    }
  },

  // Delete category
  async deleteCategory(req: Request, res: Response) {
    try {
      const categoryId = req.params.id;
      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({ 
          success: false,
          message: 'Category not found' 
        });
      }

      // Check if user has permission to delete
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          message: 'Access denied' 
        });
      }

      await Category.findByIdAndDelete(categoryId);

      return res.json({ 
        success: true,
        message: 'Category deleted successfully' 
      });
    } catch (error: any) {
      return res.status(500).json({ 
        success: false,
        message: 'Server error', 
        error: error.message 
      });
    }
  }
};

export default categoryController;