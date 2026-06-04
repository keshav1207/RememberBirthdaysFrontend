import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from 'react-oauth2-code-pkce';
import Navbar from '../../components/navbar';

// Mock toast — navbar calls it on logout
jest.mock('react-toastify', () => ({
    toast: { success: jest.fn() }
}));

// Helper — renders Navbar with a fake auth context
const renderNavbar = (roles: string[] = []) => {
    return render(
        <AuthContext.Provider value={{
            tokenData: { realm_access: { roles }, sub: 'user-123' },
            logOut: jest.fn(),
            token: 'fake-token',
        } as any}>
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        </AuthContext.Provider>
    );
};

describe('Navbar', () => {

    test('renders the brand name', () => {
        // ARRANGE + ACT
        renderNavbar();

        // ASSERT
        expect(screen.getByText('Remember Birthdays')).toBeInTheDocument();
    });

    test('shows regular user links when user is not admin', () => {
        // ARRANGE + ACT
        renderNavbar([]);

        // ASSERT
        expect(screen.getAllByText('All Birthdays').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Add Birthday').length).toBeGreaterThan(0);
        expect(screen.getAllByText('My Info').length).toBeGreaterThan(0);
    });

    test('shows Admin link when user has Admin role', () => {
        // ARRANGE + ACT
        renderNavbar(['Admin']);

        // ASSERT
        expect(screen.getAllByText('Admin').length).toBeGreaterThan(0);
    });

    test('hides regular user links when user is admin', () => {
        // ARRANGE + ACT
        renderNavbar(['Admin']);

        // ASSERT
        expect(screen.queryByText('All Birthdays')).not.toBeInTheDocument();
        expect(screen.queryByText('Add Birthday')).not.toBeInTheDocument();
        expect(screen.queryByText('My Info')).not.toBeInTheDocument();
    });

    test('always shows Log out button regardless of role', () => {
        // ARRANGE + ACT
        renderNavbar([]);

        // ASSERT
        expect(screen.getAllByText('Log out').length).toBeGreaterThan(0);
    });

});