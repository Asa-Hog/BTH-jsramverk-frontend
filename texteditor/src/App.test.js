import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils';
// import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';
import App from './App';
// import {sendEmail} from './App';
import Editor from './components/Editor';
// import { shallow } from 'enzyme';


import authModel from "./models/auth"
import docsModel from "./models/docsModel"

let sendEmail = async (email) => {
	let res = await authModel.invite(email);

	if (res.status === 200 ) {
		setTimeout(function () {window.alert("Email sent.");}, 1000);
	}
};

function handlePrint() {
	if (docType === "text") {
		printText();
	}

	if (docType === "code") {
		printCode();
	}
};

beforeEach(() => {
  render (<App />)
})

afterAll(async() => {
	await docsModel.reset();
});

describe('Tests on log in page', () => {
    test('Email field should be in document', () => {
        const emailArea = screen.getByLabelText( 'Email')

        expect(emailArea).toBeInTheDocument()
    });

    test('Password field should be in document', () => {
        const pwdArea = screen.getByLabelText( 'Password')

        expect(pwdArea).toBeInTheDocument()
    });

    test('Button with name Log in should exist', () => {
		const button = screen.getByRole("button", {name: 'Log in'})

		expect(button).toBeInTheDocument()
    });

    test('Button with name Sign up should exist', () => {
		const button = screen.getByRole("button", {name: 'Sign up'})

		expect(button).toBeInTheDocument()
    });
});


describe('Tests after log in', () => {
    beforeEach(async() => {
        const emailArea = screen.getByLabelText('Email');
        const pwdArea = screen.getByLabelText( 'Password');
        const loginButton = screen.getByRole("button", {name: 'Log in'});
        const registerButton = screen.getByRole("button", {name: 'Sign up'});
  
        userEvent.type(emailArea, "test@test.com");
        userEvent.type(pwdArea, "123");
  
        await act(async() => {
          userEvent.click(registerButton);
        })
  
        await act(async() => {
          userEvent.click(loginButton);
        })
    });

    test('Button with name Create should exist after log in', async () => {
		
        const createButton = await screen.findByRole("button", {name: 'Create'})

		expect(createButton).toBeInTheDocument()

    });

    test('Button with name Update should exist after log in', async () => {

        const updateButton = await screen.findByRole("button", {name: 'Update'})

        expect(updateButton).toBeInTheDocument();

    });

    test('Button with name Print should exist after log in', async () => {
		jest.useFakeTimers('legacy');

        const printButton = await screen.findByRole("button", { name: 'Print' })

        expect(printButton).toBeInTheDocument();

    });

    test('Button with name Invite should exist after log in', async () => {
        const inviteButton = await screen.findByRole("button", { name: 'Invite' })

        expect(inviteButton).toBeInTheDocument();
    });

    test('Button with name Code should exist after log in', async () => {
        const codeButton = await screen.findByRole("button", { name: 'Code' })

        expect(codeButton).toBeInTheDocument();
    });

    test('Textbox should appear after button Create is pressed', async () => {
		const button = await screen.findByRole("button", {name: 'Create'})

		expect(button).toBeInTheDocument()

        fireEvent.click(button);

        const textbox = await screen.findByRole("textbox")

        expect(textbox).toBeInTheDocument()
    });

    test('Text Name of file should appear after button Create is pressed', async () => {
        const button = await screen.findByRole("button", {name: 'Create'});

	    expect(button).toBeInTheDocument()
        fireEvent.click(button);

        const text = await screen.findByText(/Name of file/i);

        expect(text).toBeInTheDocument();
    });

    test('Save button should appear after button Create is pressed', async () => {
        const createButton = await screen.findByRole("button", {name: 'Create'});

		expect(createButton).toBeInTheDocument()
        fireEvent.click(createButton);

        const saveButton = await screen.findByRole("button", {name: 'Save'});

        expect(saveButton).toBeInTheDocument();
    });


    test('After writing text in text editor the textbox element should contain that text ', async () => {
        const trixeditor = await screen.findByRole("textbox")

		expect(trixeditor).toBeInTheDocument()
        fireEvent.click(trixeditor);
        fireEvent.change(trixeditor, {target: {value: 'hello'}})

        expect(trixeditor.value).toBe("hello");
    });

    test('After clicking invite button a prompt should appear in the document', async () => {
		window.prompt = jest.fn();

        const inviteButton = await screen.findByRole("button", {name: 'Invite'})

        fireEvent.click(inviteButton)

		expect(window.prompt).toHaveBeenCalledTimes(1);
    });




	// test('After clicking Print the handlePrint function should be called', async () => {
		// handlePrint = jest.fn();
		
		// const printButton = await screen.findByRole("button", {name: 'Print'});

		// fireEvent.click(printButton); 

		// expect(handlePrint).toHaveBeenCalledTimes(1);
		
		// const pdfView = await screen.findByRole("textbox");


		// expect(pdfView).toBeInTheDocument();
		// expect(handlePrint).toHaveBeenCalledTimes(1);
	// });




	test('After clicking Code button a code editor and result terminal should appear along with buttons Execute and Return to text mode', async () => {
		const codeButton = await screen.findByRole("button", {name: 'Code'})

		fireEvent.click(codeButton)

		// const codeEditor = await screen.findByText("JS code editor");
		// let element = document.querySelector("code-editor"); // trix finns men inte code. code är den jag vill ska finnas
		// const executeButton = await screen.findByRole("button", {name: 'Execute'})
		// const resultTerminal = await screen.findByText('Result terminal')
		// const returnButton = await screen.findByRole("button", {name: 'Return to text mode'})

		// expect(codeEditor).toBeInTheDocument();
		expect(element).toBeInTheDocument();
		// expect(executeButton).toBeInTheDocument();
		// expect(resultTerminal).toBeInTheDocument();
		// expect(returnButton).toBeInTheDocument();
	});



});


    // test('Select list should exist after log in', async () => {

    //     const selectList = await screen.findByRole("option")[0];

    //     expect(selectList).toBeInTheDocument();

    // });

	//     test('Text with name Choose document should exist after log in', async () => {

    //     const text = await screen.findByLabelText("App users")

    //     expect(text).toBeInTheDocument();

    // });


	// const inviteButton1 = screen.findByRole("button", {name: 'Invgite'}) // Ger rätt fast är fel
	// const inviteButton2 = screen.findByRole("button", {name: 'Invite'}) // Ger rätt - är rätt (men inte "frågan")
	// Ovanstående ger rätt oavsett vad man skriver i

	// const inviteButton3 = await screen.findByRole("button", {name: 'Invgite'}) // Blir fel
	// const inviteButton = await screen.findByRole("button", {name: 'Invite'}) // Blir rätt



// // expect(await screen.findByText('some text')).not.toBe(null)

// // Användaren ska trycka på Update-knappen utan att ha valt ett dokument i listan, och få error?
