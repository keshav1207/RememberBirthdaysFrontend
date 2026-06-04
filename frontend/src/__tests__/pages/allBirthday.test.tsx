import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthContext } from 'react-oauth2-code-pkce';
import AllBirthday from '../../pages/allBirthday';
import api from '../../services/api';

// Mock Navbar — avoids router and auth context setup
jest.mock('../../components/navbar', () => () => <div>Navbar</div>);

// Mock toast — prevents rendering issues in test environment
jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() }
}));

// Mock api — prevents real HTTP calls
jest.mock('../../services/api', () => ({
    __esModule: true,
    default: { get: jest.fn(), delete: jest.fn(), put: jest.fn() }
}));

// Helper — renders AllBirthday with fake auth context
const renderAllBirthday = () => {
    return render(
        <AuthContext.Provider value={{
            token: 'fake-token',
            tokenData: { realm_access: { roles: [] }, sub: 'user-123' },
            logOut: jest.fn(),
        } as any}>
            <AllBirthday />
        </AuthContext.Provider>
    );
};

describe('AllBirthday', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders birthday list from API response', async () => {
        // ARRANGE
        (api.get as jest.Mock).mockResolvedValue({
            data: [
                { id: 1, firstName: 'John', lastName: 'Doe', birthDate: '1990-05-15' },
                { id: 2, firstName: 'Jane', lastName: 'Smith', birthDate: '1985-03-22' }
            ]
        });

        // ACT
        renderAllBirthday();

        // ASSERT — wait for async data to load before asserting
        await waitFor(() => {
            expect(screen.getByText('John')).toBeInTheDocument();
            expect(screen.getByText('Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane')).toBeInTheDocument();
            expect(screen.getByText('Smith')).toBeInTheDocument();
        });
    });

    test('shows empty state message when no birthdays exist', async () => {
        // ARRANGE
        (api.get as jest.Mock).mockResolvedValue({ data: [] });

        // ACT
        renderAllBirthday();

        // ASSERT
        await waitFor(() => {
            expect(screen.getByText('No birthdays have been added yet.')).toBeInTheDocument();
        });
    });

    test('shows delete confirmation dialog when delete button is clicked', async () => {
        // ARRANGE
        (api.get as jest.Mock).mockResolvedValue({
            data: [{ id: 1, firstName: 'John', lastName: 'Doe', birthDate: '1990-05-15' }]
        });
        renderAllBirthday();

        // Wait for data to load first
        await waitFor(() => {
            expect(screen.getByText('John')).toBeInTheDocument();
        });

        // ACT — click the delete icon button
        userEvent.click(screen.getByTestId('DeleteIcon').closest('button')!);

        // ASSERT
        await waitFor(() => {
            expect(screen.getByText('Delete Birthday?')).toBeInTheDocument();
        });
    });

    test('calls api.delete when delete is confirmed', async () => {
        // ARRANGE
        (api.get as jest.Mock).mockResolvedValue({
            data: [{ id: 1, firstName: 'John', lastName: 'Doe', birthDate: '1990-05-15' }]
        });
        (api.delete as jest.Mock).mockResolvedValue({ data: {} });
        renderAllBirthday();

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('John')).toBeInTheDocument();
        });

        // ACT — click delete icon, then confirm in dialog
        userEvent.click(screen.getByTestId('DeleteIcon').closest('button')!);

        await waitFor(() => {
            expect(screen.getByText('Delete Birthday?')).toBeInTheDocument();
        });

        userEvent.click(screen.getByRole('button', { name: /^delete$/i }));

        // ASSERT
        await waitFor(() => {
            expect(api.delete).toHaveBeenCalled();
        });
    });

});