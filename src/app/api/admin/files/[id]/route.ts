import { NextRequest, NextResponse } from 'next/server';
import { asyncErrorHandler } from '@/middleware/errorHandler';
import { 
  APIResponse, 
  File,
  ValidationError,
  NotFoundError
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

// GET /api/admin/files/[id] - Get specific file by ID
export const GET = asyncErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  
  const file = mockFiles.find(f => f.id === id);
  
  if (!file) {
    throw new NotFoundError('File not found');
  }
  
  const response: APIResponse<File> = {
    success: true,
    data: file
  };
  
  return NextResponse.json(response);
});

// PUT /api/admin/files/[id] - Update file metadata
export const PUT = asyncErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const body = await request.json();
  
  const fileIndex = mockFiles.findIndex(f => f.id === id);
  if (fileIndex === -1) {
    throw new NotFoundError('File not found');
  }
  
  // Only allow updating metadata, not the file itself
  const allowedFields = ['alt', 'description', 'metadata'];
  const updates: Partial<File> = {};
  
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      (updates as any)[field] = body[field];
    }
  }
  
  if (Object.keys(updates).length === 0) {
    throw new ValidationError('No valid fields to update');
  }
  
  // Update file metadata
  mockFiles[fileIndex] = {
    ...mockFiles[fileIndex],
    ...updates
  };
  
  const response: APIResponse<File> = {
    success: true,
    data: mockFiles[fileIndex],
    message: 'File updated successfully'
  };
  
  return NextResponse.json(response);
});

// DELETE /api/admin/files/[id] - Delete specific file
export const DELETE = asyncErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  
  const fileIndex = mockFiles.findIndex(f => f.id === id);
  if (fileIndex === -1) {
    throw new NotFoundError('File not found');
  }
  
  // In production, delete from cloud storage
  const deletedFile = mockFiles[fileIndex];
  mockFiles.splice(fileIndex, 1);
  
  const response: APIResponse = {
    success: true,
    message: `File ${deletedFile.filename} deleted successfully`
  };
  
  return NextResponse.json(response);
});