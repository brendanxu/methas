import { NextRequest, NextResponse } from 'next/server';
import { asyncErrorHandler } from '@/middleware/errorHandler';
import MockDatabase, { 
  APIResponse, 
  Content,
  ValidationError,
  NotFoundError,
  generateSlug,
  sanitizeContent
} from '@/lib/database';

// GET /api/admin/content/[id] - Get specific content by ID
export const GET = asyncErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  
  const content = await MockDatabase.getContentById(id);
  
  if (!content) {
    throw new NotFoundError('Content not found');
  }
  
  const response: APIResponse<Content> = {
    success: true,
    data: content
  };
  
  return NextResponse.json(response);
});

// PUT /api/admin/content/[id] - Update specific content
export const PUT = asyncErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const body = await request.json();
  
  // Check if content exists
  const existingContent = await MockDatabase.getContentById(id);
  if (!existingContent) {
    throw new NotFoundError('Content not found');
  }
  
  // Validate updates
  const errors: string[] = [];
  
  if (body.title !== undefined && body.title.length < 1) {
    errors.push('Title cannot be empty');
  }
  
  if (body.content !== undefined && body.content.length < 10) {
    errors.push('Content must be at least 10 characters');
  }
  
  if (body.type !== undefined && !['news', 'service', 'case-study', 'success-story', 'page'].includes(body.type)) {
    errors.push('Invalid content type');
  }
  
  if (body.status !== undefined && !['draft', 'published', 'archived'].includes(body.status)) {
    errors.push('Invalid status');
  }
  
  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '));
  }
  
  // Process updates
  const updates = { ...body };
  
  // Generate slug if title changed
  if (body.title && body.title !== existingContent.title) {
    updates.slug = generateSlug(body.title);
  }
  
  // Sanitize content
  if (body.content) {
    updates.content = sanitizeContent(body.content);
  }
  
  // Set publish date when status changes to published
  if (body.status === 'published' && existingContent.status !== 'published') {
    updates.publishedAt = new Date();
  }
  
  const updatedContent = await MockDatabase.updateContent(id, updates);
  
  const response: APIResponse<Content> = {
    success: true,
    data: updatedContent!,
    message: 'Content updated successfully'
  };
  
  return NextResponse.json(response);
});

// DELETE /api/admin/content/[id] - Delete specific content
export const DELETE = asyncErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  
  const deleted = await MockDatabase.deleteContent(id);
  
  if (!deleted) {
    throw new NotFoundError('Content not found');
  }
  
  const response: APIResponse = {
    success: true,
    message: 'Content deleted successfully'
  };
  
  return NextResponse.json(response);
});

// PATCH /api/admin/content/[id] - Partial update (e.g., status only)
export const PATCH = asyncErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const body = await request.json();
  
  // Check if content exists
  const existingContent = await MockDatabase.getContentById(id);
  if (!existingContent) {
    throw new NotFoundError('Content not found');
  }
  
  // Common patch operations
  const updates: Partial<Content> = {};
  
  // Status change
  if (body.status) {
    if (!['draft', 'published', 'archived'].includes(body.status)) {
      throw new ValidationError('Invalid status');
    }
    updates.status = body.status;
    
    // Set publish date when publishing
    if (body.status === 'published' && existingContent.status !== 'published') {
      updates.publishedAt = new Date();
    }
  }
  
  // Featured image
  if (body.featuredImage !== undefined) {
    updates.featuredImage = body.featuredImage;
  }
  
  // Tags
  if (body.tags !== undefined) {
    updates.tags = Array.isArray(body.tags) ? body.tags : [];
  }
  
  // Category
  if (body.category !== undefined) {
    updates.category = body.category;
  }
  
  // Metadata
  if (body.metadata !== undefined) {
    updates.metadata = { ...existingContent.metadata, ...body.metadata };
  }
  
  const updatedContent = await MockDatabase.updateContent(id, updates);
  
  const response: APIResponse<Content> = {
    success: true,
    data: updatedContent!,
    message: 'Content updated successfully'
  };
  
  return NextResponse.json(response);
});