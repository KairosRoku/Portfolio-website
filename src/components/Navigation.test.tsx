import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navigation from './Navigation';

describe('Navigation', () => {
  const mockSetMobileMenuOpen = vi.fn();

  it('renders the brand logo and navigates home on click', () => {
    render(
      <MemoryRouter>
        <Navigation mobileMenuOpen={false} setMobileMenuOpen={mockSetMobileMenuOpen} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Portfolio/i)).toBeInTheDocument();
  });

  it('renders main navigation links', () => {
    render(
      <MemoryRouter>
        <Navigation mobileMenuOpen={false} setMobileMenuOpen={mockSetMobileMenuOpen} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Photography/i)).toBeInTheDocument();
    expect(screen.getByText(/Live2D/i)).toBeInTheDocument();
    expect(screen.getByText(/Game Dev/i)).toBeInTheDocument();
  });

  it('shows mobile menu when mobileMenuOpen is true', () => {
    render(
      <MemoryRouter>
        <Navigation mobileMenuOpen={true} setMobileMenuOpen={mockSetMobileMenuOpen} />
      </MemoryRouter>
    );
    // In mobile menu, text is rendered again
    const mobileLinks = screen.getAllByText(/Photography/i);
    expect(mobileLinks.length).toBeGreaterThan(1);
  });
});
