export const mockPricebookService = {
  id: 999001,
  name: 'Test Service',
  code: 'TEST-SVC-001',
  description: 'A test service for unit tests',
  price: 149.99,
  cost: 50.00,
  active: true,
  categoryId: 1,
  businessUnitId: 1,
  createdOn: '2025-01-01T00:00:00Z',
  modifiedOn: '2025-01-15T00:00:00Z',
};

export const mockPricebookMaterial = {
  id: 999002,
  name: 'Test Material',
  code: 'TEST-MAT-001',
  description: 'A test material',
  price: 29.99,
  cost: 10.00,
  active: true,
  categoryId: 1,
  vendorId: null,
  createdOn: '2025-01-01T00:00:00Z',
  modifiedOn: '2025-01-15T00:00:00Z',
};

export const mockCustomer = {
  id: 999003,
  name: 'Test Customer',
  type: 'Residential',
  email: 'test@example.com',
  phone: '555-0100',
  address: {
    street: '123 Test St',
    city: 'Testville',
    state: 'FL',
    zip: '33755',
  },
  active: true,
  createdOn: '2025-01-01T00:00:00Z',
  modifiedOn: '2025-01-15T00:00:00Z',
};

export const mockJob = {
  id: 999004,
  number: 'JOB-TEST-001',
  customerId: 999003,
  locationId: 1,
  jobTypeId: 1,
  businessUnitId: 1,
  jobStatus: 'Scheduled',
  summary: 'Test job for testing',
  createdOn: '2025-01-01T00:00:00Z',
  modifiedOn: '2025-01-15T00:00:00Z',
};

export const mockSTListResponse = <T>(data: T[]) => ({
  data,
  page: 1,
  pageSize: 50,
  totalCount: data.length,
  hasMore: false,
});
