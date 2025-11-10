import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../Layout';

describe('Layout Component', () => {
  const renderLayout = () => {
    return render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
  };

  it('should render the header with logo', () => {
    renderLayout();
    expect(screen.getByLabelText('A KI PRI SA YÉ - Accueil')).toBeInTheDocument();
  });

  it('should render skip to content link', () => {
    renderLayout();
    expect(screen.getByText('Aller au contenu principal')).toBeInTheDocument();
  });

  it('should render desktop navigation links', () => {
    renderLayout();
    const comparateurLinks = screen.getAllByText('Comparateur');
    expect(comparateurLinks.length).toBeGreaterThan(0);
  });

  it('should render mobile menu button', () => {
    renderLayout();
    expect(screen.getByLabelText('Menu')).toBeInTheDocument();
  });

  it('should open mobile navigation when burger menu is clicked', () => {
    renderLayout();
    const burgerButton = screen.getByLabelText('Menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    expect(mobileNav).not.toHaveClass('active');
    
    fireEvent.click(burgerButton);
    
    expect(mobileNav).toHaveClass('active');
  });

  it('should close mobile navigation when close button is clicked', () => {
    renderLayout();
    const burgerButton = screen.getByLabelText('Menu');
    const closeButton = screen.getByLabelText('Fermer le menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    // Open menu
    fireEvent.click(burgerButton);
    expect(mobileNav).toHaveClass('active');
    
    // Close menu
    fireEvent.click(closeButton);
    expect(mobileNav).not.toHaveClass('active');
  });

  it('should close mobile navigation when Escape key is pressed', () => {
    renderLayout();
    const burgerButton = screen.getByLabelText('Menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    // Open menu
    fireEvent.click(burgerButton);
    expect(mobileNav).toHaveClass('active');
    
    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mobileNav).not.toHaveClass('active');
  });

  it('should render footer with links', () => {
    renderLayout();
    expect(screen.getByText('Mentions légales')).toBeInTheDocument();
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
  });

  it('should render footer copyright', () => {
    renderLayout();
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  it('should have main content with proper id for skip link', () => {
    renderLayout();
    const mainContent = document.getElementById('main-content');
    expect(mainContent).toBeInTheDocument();
  });
});
