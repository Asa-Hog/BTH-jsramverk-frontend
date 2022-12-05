import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils';
import App from './App';

describe('Tests on log in page', () => {
    test('Email field should be in document', () => {
        render (<App />)
        const emailArea = screen.getByLabelText( 'Email')

        expect(emailArea).toBeInTheDocument()
    });

    test('Password field should be in document', () => {
        render (<App />)
        const pwdArea = screen.getByLabelText( 'Password')

        expect(pwdArea).toBeInTheDocument()
    });

    test('Button with name Log in should exist', () => {
        render (<App />)
		const button = screen.getByRole("button", {name: 'Log in'})

		expect(button).toBeInTheDocument()
    });

    test('Button with name Sign up should exist', () => {
        render (<App />)
		const button = screen.getByRole("button", {name: 'Sign up'})

		expect(button).toBeInTheDocument()
    });
});


describe('Tests after log in', () => {
    beforeEach(async() => {
        render (<App />);

        const emailArea = screen.getByLabelText('Email');
        const pwdArea = screen.getByLabelText( 'Password');
        const loginButton = screen.getByRole("button", {name: 'Log in'});
        const registerButton = screen.getByRole("button", {name: 'Sign up'});
  
        userEvent.type(emailArea, "test@test.com");
        userEvent.type(pwdArea, "123");
  
        await act(async() => {
          userEvent.click(registerButton);
        });
  
        await act(async() => {
          userEvent.click(loginButton);
        });
    });

    test('Button with name Create should exist after log in', async () => {
		
        const createButton = await screen.findByRole("button", {name: 'Create'});

		expect(createButton).toBeInTheDocument();

    });

    test('Button with name Update should exist after log in', async () => {

        const updateButton = await screen.findByRole("button", {name: 'Update'});

        expect(updateButton).toBeInTheDocument();

    });

    test('Button with name Print should exist after log in', async () => {
        const printButton = await screen.findByRole("button", { name: 'Print' });

        expect(printButton).toBeInTheDocument();

    });

    test('Button with name Invite should exist after log in', async () => {
        const inviteButton = await screen.findByRole("button", { name: 'Invite' });

        expect(inviteButton).toBeInTheDocument();
    });

    test('Button with name Code should exist after log in', async () => {
        const codeButton = await screen.findByRole("button", { name: 'Code' });

        expect(codeButton).toBeInTheDocument();
    });

    test('Button with name Comment should exist after log in', async () => {
        const commentButton = await screen.findByRole("button", { name: 'Comment' });

        expect(commentButton).toBeInTheDocument();
    });

    test('Textbox should appear after button Create is pressed', async () => {
		const button = await screen.findByRole("button", {name: 'Create'});

		expect(button).toBeInTheDocument();

        fireEvent.click(button);

        const textbox = await screen.findByRole("textbox");

        expect(textbox).toBeInTheDocument();
    });

    test('Text Name of file should appear after button Create is pressed', async () => {
        const button = await screen.findByRole("button", {name: 'Create'});

	    expect(button).toBeInTheDocument();

        fireEvent.click(button);

        const text = await screen.findByText(/Name of file/i);

        expect(text).toBeInTheDocument();
    });

    test('Save button should appear after button Create is pressed', async () => {
        const createButton = await screen.findByRole("button", {name: 'Create'});

		expect(createButton).toBeInTheDocument();

        fireEvent.click(createButton);

        const saveButton = await screen.findByRole("button", {name: 'Save'});

        expect(saveButton).toBeInTheDocument();
    });

    test('After writing text in text editor the textbox element should contain that text ', async () => {
        const trixeditor = await screen.findByRole("textbox");

		expect(trixeditor).toBeInTheDocument();

        fireEvent.click(trixeditor);
        fireEvent.change(trixeditor, {target: {value: 'hello'}});

        expect(trixeditor.value).toBe("hello");
    });

    test('After clicking invite button a prompt should appear in the document', async () => {
		window.prompt = jest.fn();

        const inviteButton = await screen.findByRole("button", {name: 'Invite'});

        fireEvent.click(inviteButton);

		expect(window.prompt).toHaveBeenCalledTimes(1);
    });

	test('After clicking Code button a code editor and result terminal should appear along with buttons Execute and Return to text mode', async () => {
		const codeButton = await screen.findByRole("button", {name: 'Code'});

		fireEvent.click(codeButton);

		const codeEditor = await screen.findByText("JS code editor");
		const executeButton = await screen.findByRole("button", {name: 'Execute'});
		const resultTerminal = await screen.findByText('Result terminal');
		const returnButton = await screen.findByRole("button", {name: 'Return to text mode'});

		expect(codeEditor).toBeInTheDocument();
		expect(executeButton).toBeInTheDocument();
		expect(resultTerminal).toBeInTheDocument();
		expect(returnButton).toBeInTheDocument();
	});

    test('After clicking Comment button an alert box should appear in the document', async () => {
		window.alert = jest.fn();

        const commentButton = await screen.findByRole("button", {name: 'Comment'});

        fireEvent.click(commentButton);

		expect(window.alert).toHaveBeenCalledTimes(1);
    });

});




    /////////////////////////////////////////////////////////////////////////////////

    // Utan async - nedanstående ger rätt oavsett vad man skriver
	// const button = screen.findByRole("button", {name: 'Invgite'}) // Ger rätt fast är fel
	// const button = screen.findByRole("button", {name: 'Invite'}) // Ger rätt - men testar inte "frågan"
	
    // Med async
	// const button = await screen.findByRole("button", {name: 'Invgite'}) // Blir fel
	// const button = await screen.findByRole("button", {name: 'Invite'}) // Blir rätt

