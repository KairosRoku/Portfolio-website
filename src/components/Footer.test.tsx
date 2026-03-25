import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('renders or contains the footer brand text', () => {
    render(<Footer />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent(/Creative Portfolio/);
  });

  it('renders section buttons', () => {
    render(<Footer />);
    expect(screen.getByText(/Photography/i)).toBeInTheDocument();
    expect(screen.getByText(/Live2D Rigging/i)).toBeInTheDocument();
    expect(screen.getByText(/Game Development/i)).toBeInTheDocument();
  });

  it('renders social icons', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(3);
  });
});
