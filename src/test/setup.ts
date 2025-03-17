import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'
import { server } from './mocks/server'

// Extend Vitest's expect method with testing-library methods
expect.extend(matchers)

// Run cleanup after each test case
afterEach(() => {
  cleanup()
})

// Setup MSW server for API mocking
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())