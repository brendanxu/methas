import { NextRequest, NextResponse } from 'next/server';
import { asyncErrorHandler } from '@/middleware/errorHandler';
import MockDatabase, { 
  ContentQueryParams, 
  APIResponse, 
  Content,
  contentValidation,
  ValidationError,
  generateSlug,
  sanitizeContent
} from '@/lib/database';

// GET /api/admin/content - Get all content with filtering and pagination
export const GET = asyncErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  const params: ContentQueryParams = {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || 'updatedAt',
    order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    type: searchParams.get('type') as Content['type'] || undefined,
    status: searchParams.get('status') as Content['status'] || undefined,
    author: searchParams.get('author') || undefined,
    category: searchParams.get('category') || undefined,
    tag: searchParams.get('tag') || undefined,
    dateFrom: searchParams.get('dateFrom') || undefined,
    dateTo: searchParams.get('dateTo') || undefined,
  };

  const { data, total } = await MockDatabase.getContents(params);
  
  const response: APIResponse<Content[]> = {
    success: true,
    data,
    pagination: {
      page: params.page || 1,
      limit: params.limit || 10,
      total,
      totalPages: Math.ceil(total / (params.limit || 10))
    }
  };

  return NextResponse.json(response);
});

// POST /api/admin/content - Create new content
export const POST = asyncErrorHandler(async (request: NextRequest) => {
  const body = await request.json();
  
  // Validate required fields
  const errors: string[] = [];
  
  if (!body.title || body.title.length < 1) {
    errors.push('Title is required');
  }
  
  if (!body.content || body.content.length < 10) {
    errors.push('Content must be at least 10 characters');
  }
  
  if (!body.type || !['news', 'service', 'case-study', 'success-story', 'page'].includes(body.type)) {
    errors.push('Valid content type is required');
  }
  
  if (!body.status || !['draft', 'published', 'archived'].includes(body.status)) {
    errors.push('Valid status is required');
  }
  
  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '));
  }
  
  // Generate slug if not provided
  if (!body.slug) {
    body.slug = generateSlug(body.title);
  }
  
  // Sanitize content
  body.content = sanitizeContent(body.content);
  
  // Set author (in production, get from auth session)
  body.authorId = body.authorId || '1';
  
  // Set publish date for published content
  if (body.status === 'published' && !body.publishedAt) {
    body.publishedAt = new Date();
  }
  
  const newContent = await MockDatabase.createContent(body);
  
  const response: APIResponse<Content> = {
    success: true,
    data: newContent,
    message: 'Content created successfully'
  };
  
  return NextResponse.json(response, { status: 201 });
});

// PUT /api/admin/content - Bulk update content
export const PUT = asyncErrorHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { ids, updates } = body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new ValidationError('Content IDs are required');
  }
  
  const results = [];
  
  for (const id of ids) {
    const updated = await MockDatabase.updateContent(id, updates);
    if (updated) {
      results.push(updated);
    }
  }
  
  const response: APIResponse<Content[]> = {
    success: true,
    data: results,
    message: `${results.length} content items updated successfully`
  };
  
  return NextResponse.json(response);
});

// DELETE /api/admin/content - Bulk delete content
export const DELETE = asyncErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');
  
  if (!idsParam) {
    throw new ValidationError('Content IDs are required');
  }
  
  const ids = idsParam.split(',');
  let deletedCount = 0;
  
  for (const id of ids) {
    const deleted = await MockDatabase.deleteContent(id.trim());
    if (deleted) {
      deletedCount++;
    }
  }
  
  const response: APIResponse = {
    success: true,
    message: `${deletedCount} content items deleted successfully`
  };
  
  return NextResponse.json(response);
});