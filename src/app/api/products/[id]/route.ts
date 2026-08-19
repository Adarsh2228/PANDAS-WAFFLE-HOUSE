import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { reviews: true },
    });

    if (!item) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    let imagesList: string[] = [];
    try {
      if (item.images) imagesList = JSON.parse(item.images);
      else if (item.imageUrl) imagesList = [item.imageUrl];
    } catch {
      imagesList = item.imageUrl ? [item.imageUrl] : [];
    }

    return NextResponse.json({ success: true, data: { ...item, images: imagesList } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      description,
      basePrice,
      category,
      imageUrl,
      images,
      isEnabled,
      isTrending,
      isOffer,
      prepTime,
      priceSmall,
      priceBig,
      price5pc,
      price10pc,
      subtitle,
      rating,
      reviewCount,
    } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (description !== undefined) dataToUpdate.description = description;
    if (basePrice !== undefined) dataToUpdate.basePrice = Number(basePrice);
    if (category !== undefined) dataToUpdate.category = category;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;
    if (images !== undefined) {
      dataToUpdate.images = Array.isArray(images) ? JSON.stringify(images) : images;
      if (Array.isArray(images) && images.length > 0 && !imageUrl) {
        dataToUpdate.imageUrl = images[0];
      }
    }
    if (isEnabled !== undefined) dataToUpdate.isEnabled = Boolean(isEnabled);
    if (isTrending !== undefined) dataToUpdate.isTrending = Boolean(isTrending);
    if (isOffer !== undefined) dataToUpdate.isOffer = Boolean(isOffer);
    if (prepTime !== undefined) dataToUpdate.prepTime = prepTime;
    if (priceSmall !== undefined) dataToUpdate.priceSmall = priceSmall === null ? null : Number(priceSmall);
    if (priceBig !== undefined) dataToUpdate.priceBig = priceBig === null ? null : Number(priceBig);
    if (price5pc !== undefined) dataToUpdate.price5pc = price5pc === null ? null : Number(price5pc);
    if (price10pc !== undefined) dataToUpdate.price10pc = price10pc === null ? null : Number(price10pc);
    if (subtitle !== undefined) dataToUpdate.subtitle = subtitle;
    if (rating !== undefined) dataToUpdate.rating = Number(rating);
    if (reviewCount !== undefined) dataToUpdate.reviewCount = Number(reviewCount);

    const updated = await prisma.menuItem.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error(`API /api/products/[id] PUT error:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Typically used for toggling isEnabled: { isEnabled: true/false }
    const updated = await prisma.menuItem.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error(`API /api/products/[id] PATCH error:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update status' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.menuItem.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    console.error(`API /api/products/[id] DELETE error:`, error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
