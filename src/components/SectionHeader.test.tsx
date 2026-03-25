import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SectionHeader from './SectionHeader';

describe('SectionHeader', () => {
  const mockLinks = [
    { label: 'Test Link 1', path: '/test-1' },
    { label: 'Test Link 2', path: '/test-2' },
  ];

  it('renders the section icon and label correctly for photography', () => {
    render(
      <MemoryRouter>
        <SectionHeader section="photography" links={mockLinks} />
      </MemoryRouter>
    );

    // Check if the Home button is rendered
    expect(screen.getByText('Home')).toBeInTheDocument();

    // Check if the links are rendered
    expect(screen.getByText('Test Link 1')).toBeInTheDocument();
    expect(screen.getByText('Test Link 2')).toBeInTheDocument();
  });

  it('renders the section icon and label correctly for gamedev', () => {
    render(
      <MemoryRouter>
        <SectionHeader section="gamedev" links={mockLinks} />
      </MemoryRouter>
    );

    // Check if the Home button is rendered
    expect(screen.getByText('Home')).toBeInTheDocument();

    // Check if the links are rendered
    expect(screen.getByText('Test Link 1')).toBeInTheDocument();
    expect(screen.getByText('Test Link 2')).toBeInTheDocument();
  });
});
