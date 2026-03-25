import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Hero from './Hero';

// Mock supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => Promise.resolve({ data: { value: 'true' }, error: null }))
        }))
      }))
    }))
  }
}));

describe('Hero', () => {
  it('renders the hero sections', async () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    
    expect(await screen.findByText(/Photography/i)).toBeInTheDocument();
    expect(await screen.findByText(/Live2D/i)).toBeInTheDocument();
    expect(await screen.findByText(/Game Dev/i)).toBeInTheDocument();
  });

  it('renders section descriptions', async () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );
    
    expect(await screen.findByText(/Capturing moments through the lens/i)).toBeInTheDocument();
    expect(await screen.findByText(/Bringing 2D characters to life/i)).toBeInTheDocument();
  });
});
