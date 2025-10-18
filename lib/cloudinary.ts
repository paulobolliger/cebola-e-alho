// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

// Configuração do Cloudinary (lê as variáveis do .env.local)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Garante que a URL gerada seja HTTPS
});

/**
 * Faz upload de um buffer de imagem para o Cloudinary.
 * @param imageBuffer O buffer de dados da imagem (gerado pela API da OpenAI).
 * @param publicId O ID público a ser usado (slug da receita).
 * @returns Um objeto com a URL da imagem e o Public ID.
 */
export async function uploadImageToCloudinary(
  imageBuffer: Buffer,
  publicId: string
): Promise<{ url: string; publicId: string }> {
  // Converte o Buffer para o formato Data URI (necessário para o método uploader.upload)
  const dataUri = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'cebola-e-alho/recipes', // Pasta corrigida
      public_id: publicId,
      overwrite: true,
      format: 'webp', // Recomendado para melhor performance web
      // Aplica otimizações de imagem
      transformation: [
        { width: 1024, crop: "limit" }, // Garante que a largura máxima seja 1024px
        { quality: "auto:good" }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Falha ao fazer upload da imagem para o Cloudinary.');
  }
}