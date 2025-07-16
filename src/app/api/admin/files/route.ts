import { NextRequest, NextResponse } from 'next/server';
import { asyncErrorHandler } from '@/middleware/errorHandler';
import { 
  APIResponse, 
  File,
  FileQueryParams,
  ValidationError,
  generateId,
  formatFileSize,
  validateFileType
} from '@/lib/database';

// Mock file storage - in production, this would be replaced with cloud storage
const mockFiles: File[] = [
  {
    id: '1',
    filename: 'hero-image.jpg',
    originalName: 'hero-image.jpg',
    mimeType: 'image/jpeg',
    size: 1024000,
    url: '/api/placeholder/1200/600',
    alt: 'Hero banner image',
    description: 'Main hero banner for homepage',
    uploadedBy: '1',
    createdAt: new Date(),
    metadata: {
      width: 1200,
      height: 600,
      format: 'jpeg'
    }
  },
  {
    id: '2',
    filename: 'company-logo.png',
    originalName: 'company-logo.png',
    mimeType: 'image/png',
    size: 256000,
    url: '/api/placeholder/200/100',
    alt: 'Company logo',
    description: 'Official company logo',
    uploadedBy: '1',
    createdAt: new Date(),
    metadata: {
      width: 200,
      height: 100,
      format: 'png'
    }
  }
];

// GET /api/admin/files - Get all files with filtering and pagination
export const GET = asyncErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  const params: FileQueryParams = {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '20'),
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || 'createdAt',
    order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
    mimeType: searchParams.get('mimeType') || undefined,
    extension: searchParams.get('extension') || undefined,
    size: searchParams.get('minSize') || searchParams.get('maxSize') ? {
      min: parseInt(searchParams.get('minSize') || '0'),
      max: parseInt(searchParams.get('maxSize') || '999999999')
    } : undefined
  };

  let filtered = [...mockFiles];
  
  // Apply filters
  if (params.mimeType) {
    filtered = filtered.filter(f => f.mimeType.includes(params.mimeType!));
  }
  
  if (params.extension) {
    filtered = filtered.filter(f => f.filename.endsWith(`.${params.extension}`));
  }
  
  if (params.search) {
    filtered = filtered.filter(f => 
      f.filename.toLowerCase().includes(params.search!.toLowerCase()) ||
      f.originalName.toLowerCase().includes(params.search!.toLowerCase()) ||
      f.description?.toLowerCase().includes(params.search!.toLowerCase())
    );
  }
  
  if (params.size) {
    filtered = filtered.filter(f => 
      f.size >= (params.size!.min || 0) && 
      f.size <= (params.size!.max || 999999999)
    );
  }
  
  // Apply sorting
  if (params.sort) {
    filtered.sort((a, b) => {
      const aVal = (a as any)[params.sort!];
      const bVal = (b as any)[params.sort!];
      const order = params.order === 'desc' ? -1 : 1;
      return aVal > bVal ? order : -order;
    });
  }
  
  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 20;
  const offset = (page - 1) * limit;
  const paginatedData = filtered.slice(offset, offset + limit);
  
  const response: APIResponse<File[]> = {
    success: true,
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit)
    }
  };

  return NextResponse.json(response);
});

// POST /api/admin/files - Upload new file
export const POST = asyncErrorHandler(async (request: NextRequest) => {
  const formData = await request.formData();
  const file = formData.get('file') as globalThis.File;
  
  if (!file) {
    throw new ValidationError('No file provided');
  }
  
  // Validate file type
  if (!validateFileType(file.type)) {
    throw new ValidationError('File type not allowed');
  }
  
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new ValidationError('File size too large (max 10MB)');
  }
  
  // Generate unique filename
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  const filename = `${timestamp}.${extension}`;
  
  // In production, upload to cloud storage (AWS S3, Cloudinary, etc.)
  // For now, we'll simulate the upload
  const mockUrl = `/uploads/${filename}`;
  
  const newFile: File = {
    id: generateId(),
    filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url: mockUrl,
    uploadedBy: '1', // In production, get from auth session
    createdAt: new Date(),
    metadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString()
    }
  };
  
  // Add to mock storage
  mockFiles.push(newFile);
  
  const response: APIResponse<File> = {
    success: true,
    data: newFile,
    message: 'File uploaded successfully'
  };
  
  return NextResponse.json(response, { status: 201 });
});

// DELETE /api/admin/files - Bulk delete files
export const DELETE = asyncErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get('ids');
  
  if (!idsParam) {
    throw new ValidationError('File IDs are required');
  }
  
  const ids = idsParam.split(',');
  let deletedCount = 0;
  
  for (const id of ids) {
    const index = mockFiles.findIndex(f => f.id === id.trim());
    if (index !== -1) {
      // In production, delete from cloud storage
      mockFiles.splice(index, 1);
      deletedCount++;
    }
  }
  
  const response: APIResponse = {
    success: true,
    message: `${deletedCount} files deleted successfully`
  };
  
  return NextResponse.json(response);
});