
import { query } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all payment methods
export async function getAllPaymentMethods() {
  try {
    const results = await query(
      'SELECT * FROM payment_methods ORDER BY name ASC'
    );
    return results;
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error;
  }
}

// Get a payment method by ID
export async function getPaymentMethodById(id) {
  try {
    const results = await query(
      'SELECT * FROM payment_methods WHERE id = ?',
      [id]
    );
    return results.length ? results[0] : null;
  } catch (error) {
    console.error('Error fetching payment method:', error);
    throw error;
  }
}

// Create a new payment method
export async function createPaymentMethod(paymentMethodData, imageBuffer, imageName) {
  try {
    // Create directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'payment-methods');
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Generate unique filename
    const filename = `payment_method_${Date.now()}${path.extname(imageName)}`;
    const filePath = path.join(uploadsDir, filename);
    
    // Save image
    await fs.promises.writeFile(filePath, imageBuffer);
    
    // Store image URL
    const imageUrl = `/uploads/payment-methods/${filename}`;
    
    // Insert into database
    const result = await query(
      'INSERT INTO payment_methods (name, address, image_url) VALUES (?, ?, ?)',
      [paymentMethodData.name, paymentMethodData.address, imageUrl]
    );
    
    return {
      id: result.insertId,
      imageUrl
    };
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
}

// Update a payment method
export async function updatePaymentMethod(id, paymentMethodData, imageBuffer = null, imageName = null) {
  try {
    if (imageBuffer && imageName) {
      // If there's a new image, handle it
      const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'payment-methods');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Generate unique filename
      const filename = `payment_method_${id}_${Date.now()}${path.extname(imageName)}`;
      const filePath = path.join(uploadsDir, filename);
      
      // Save new image
      await fs.promises.writeFile(filePath, imageBuffer);
      
      // Store new image URL
      const imageUrl = `/uploads/payment-methods/${filename}`;
      
      // Get old image URL to delete it
      const oldResult = await query('SELECT image_url FROM payment_methods WHERE id = ?', [id]);
      const oldImageUrl = oldResult[0]?.image_url;
      
      // Update in database with new image
      await query(
        'UPDATE payment_methods SET name = ?, address = ?, image_url = ? WHERE id = ?',
        [paymentMethodData.name, paymentMethodData.address, imageUrl, id]
      );
      
      // Delete old image if it exists and is not a default image
      if (oldImageUrl && !oldImageUrl.includes('placeholder') && fs.existsSync(path.join(__dirname, '..', '..', 'public', oldImageUrl))) {
        fs.unlinkSync(path.join(__dirname, '..', '..', 'public', oldImageUrl));
      }
      
      return { imageUrl };
    } else {
      // Update without changing the image
      await query(
        'UPDATE payment_methods SET name = ?, address = ? WHERE id = ?',
        [paymentMethodData.name, paymentMethodData.address, id]
      );
      
      return {};
    }
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw error;
  }
}

// Delete a payment method
export async function deletePaymentMethod(id) {
  try {
    // Get image URL to delete file
    const result = await query('SELECT image_url FROM payment_methods WHERE id = ?', [id]);
    const imageUrl = result[0]?.image_url;
    
    // Delete from database
    await query('DELETE FROM payment_methods WHERE id = ?', [id]);
    
    // Delete image file if it exists and is not a default image
    if (imageUrl && !imageUrl.includes('placeholder')) {
      const imagePath = path.join(__dirname, '..', '..', 'public', imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    throw error;
  }
}
