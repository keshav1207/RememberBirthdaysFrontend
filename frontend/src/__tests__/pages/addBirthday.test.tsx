import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthContext } from 'react-oauth2-code-pkce';
import AddBirthday from '../../pages/addBirthday';
import api from '../../services/api';

// Mock Navbar — avoids setting up router and auth context twice
jest.mock('../../components/navbar', () => () => <div>Navbar</div>);

// Mock toast — prevents rendering issues in test environment
jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn() }
}));

// Mock api — prevents real HTTP calls
jest.mock('../../services/api', () => ({
    __esModule: true,
    default: { post: jest.fn() }
}));

// Helper — renders AddBirthday with fake auth context
const renderAddBirthday = () => {
    return render(
        <AuthContext.Provider value={{
            token: 'fake-token',
            tokenData: { realm_access: { roles: [] }, sub: 'user-123' },
            logOut: jest.fn(),
        } as any}>
            <AddBirthday />
        </AuthContext.Provider>
    );
};

describe('AddBirthday', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders all form fields and submit button', () => {
        // ARRANGE + ACT
        renderAddBirthday();

        // ASSERT
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/birth date/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('shows validation error when firstName is empty', async () => {
        // ARRANGE + ACT
        renderAddBirthday();
        userEvent.click(screen.getByRole('button', { name: /submit/i }));

        // ASSERT
        await waitFor(() => {
            expect(screen.getByText('First name is required')).toBeInTheDocument();
        });
    });

    test('shows validation error when lastName is empty', async () => {
        // ARRANGE
        renderAddBirthday();

        // ACT
        userEvent.type(screen.getByLabelText(/first name/i), 'Alice');
        userEvent.click(screen.getByRole('button', { name: /submit/i }));

        // ASSERT
        await waitFor(() => {
            expect(screen.getByText('Last name is required')).toBeInTheDocument();
        });
    });

    test('calls api.post with correct data on valid submission', async () => {
        // ARRANGE
        (api.post as jest.Mock).mockResolvedValue({ data: {} });
        renderAddBirthday();

        // ACT
        userEvent.type(screen.getByLabelText(/first name/i), 'Alice');
        userEvent.type(screen.getByLabelText(/last name/i), 'Smith');
        fireEvent.change(screen.getByLabelText(/birth date/i), {
            target: { value: '1990-05-15' }
        });
        userEvent.click(screen.getByRole('button', { name: /submit/i }));

        // ASSERT
        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    firstName: 'Alice',
                    lastName: 'Smith',
                    birthDate: '1990-05-15'
                }),
                expect.any(Object)
            );
        });
    });

    test('shows success toast after successful submission', async () => {
        // ARRANGE
        const { toast } = require('react-toastify');
        (api.post as jest.Mock).mockResolvedValue({ data: {} });
        renderAddBirthday();

        // ACT
        userEvent.type(screen.getByLabelText(/first name/i), 'Alice');
        userEvent.type(screen.getByLabelText(/last name/i), 'Smith');
        fireEvent.change(screen.getByLabelText(/birth date/i), {
            target: { value: '1990-05-15' }
        });
        userEvent.click(screen.getByRole('button', { name: /submit/i }));

        // ASSERT
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Added Birthday successfully');
        });
    });

});