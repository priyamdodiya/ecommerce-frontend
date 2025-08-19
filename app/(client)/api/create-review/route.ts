import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    try {
        const formData = await req.formData();
        const rating = formData.get("rating");
        const reviewText = formData.get("reviewText");
        const reviewTitle = formData.get("reviewTitle");
        const publicName = formData.get("publicName");
        const productId = formData.get("productId");
        const userId = formData.get("userId");
        const reviewImage = formData.get("reviewImage") as File | null;

        if (!rating || !reviewText || !reviewTitle || !publicName || !productId || !userId) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        let imageAssetRef = null;
        if (reviewImage && reviewImage.size > 0) {
            try {
                // Upload the image to Sanity
                const imageAsset = await client.assets.upload('image', reviewImage);
                imageAssetRef = {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset._id,
                    },
                };
            } catch (imageUploadError) {
                console.error('Error uploading image to Sanity:', imageUploadError);
                return NextResponse.json({ message: 'Failed to upload image' }, { status: 500 });
            }
        }

        const doc = {
            _type: 'review',
            rating: parseInt(rating as string),
            reviewText: reviewText as string,
            reviewTitle: reviewTitle as string,
            reviewer: publicName as string,
            userId: userId as string, // Assign the user ID
            product: {
                _ref: productId as string,
                _type: 'reference',
            },
            ...(imageAssetRef && { reviewImage: imageAssetRef }), // Add image reference if it exists
        };

        const result = await client.create(doc);
        console.log('Sanity creation result:', result);

        return NextResponse.json({ message: 'Review submitted successfully!', data: result }, { status: 201 });

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}