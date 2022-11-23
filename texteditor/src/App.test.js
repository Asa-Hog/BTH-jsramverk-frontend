// import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils';
// import { createRoot } from 'react-dom/client';
// import ReactDOM from 'react-dom';
import App from './App';


test('button with name Log in should exist', () => {
  render(<App />);

  const button = screen.getByRole("button", {name: 'Log in'})

  expect(button).toBeInTheDocument();
});

test('button with name Sign up should exist', () => {
  render(<App />);

  const button = screen.getByRole("button", {name: 'Sign up'})

  expect(button).toBeInTheDocument();
});

// Lo
test('button with', () => {
  render(<App />);

  const emailArea = screen.getByRole("textbox")
  // const pwdArea = screen.getByRole("button", {name: 'Sign up'})
  // const registerButton = screen.getByRole("button", {name: 'Sign up'})

  // fireEvent.click(registerButton)


  // const updateButton = screen.getByRole("button", {name: 'Update'})

  // expect(updateButton).toBeInTheDocument();
  expect(emailArea).toBeInTheDocument();
});

// Logga in och testa sida 2
test('button with name Update should exist after log in', async () => {
  render(<App />);
  // const emailField = screen.getByRole("input", {name: 'email'})
  const emailField = getByLabelText("Email");
  const pwdField = screen.getByRole("textbox", {name: 'pwd'})
  const registerButton = screen.getByRole("button", {name: 'Sign up'})
  const loginButton = screen.getByRole("button", {name: 'Log in'})
  
  userEvent.type(emailField, "test@test.com")
  userEvent.type(pwdField, 123)

  await act(async() => {
    userEvent.click(registerButton)
  })

  await act(async() => {
    userEvent.click(loginButton)
  })

  // await waitFor(() => expect(window.location.pathname).toBe("/"))

  waitFor(() => {
    const updateButton = screen.getByRole("button", { name: 'Update' })

    expect(updateButton).toBeInTheDocument();
  });




});














// test('button with name Update should exist', () => {
//     render(<App />);

//     const button = screen.getByRole("button", {name: 'Update'})

//     expect(button).toBeInTheDocument();
// });

// test('button with name Create should exist', () => {
//   render(<App />);

//   const button = screen.getByRole("button", {name: 'Create'})

//   expect(button).toBeInTheDocument();
// });

// test('select list should exist', () => {
//   render(<App />);

//   const selectList = screen.getByRole("option")

//   expect(selectList).toBeInTheDocument();

// });

// // Användaren ska kunna se en textbox när den tryckt på 'Create new'
// test('textbox should appear when button Create is pressed', () => {
//   render(<App />);

//   const button = screen.getByRole("button", {name: 'Create'});
//   fireEvent.click(button);
//   const textbox = screen.getByRole("textbox");

//   expect(textbox).toBeInTheDocument();
// });

// // Användaren ska kunna se texten "Name of file" efter att ha tryckt på 'Create new'
// test('Text Name of file should appear when button Create is pressed', () => {
//   render(<App />);

//   const button = screen.getByRole("button", {name: 'Create'});
//   fireEvent.click(button);
//   const text = screen.getByText(/Name of file/i);

//   expect(text).toBeInTheDocument();
// });

// // Användaren ska kunna se en knapp med namn 'Save' när den tryckt på 'Create new'
// test('Button Save should appear after button Create is pressed', () => {
//   render(<App />);

//   const createNewButton = screen.getByRole("button", {name: 'Create'});
//   fireEvent.click(createNewButton);
//   const saveButton = screen.getByRole("button", {name: 'Save'});
 
//   expect(saveButton).toBeInTheDocument();
// });

// Användaren ska kunna skriva text i trix editor och sen se att textboxen har det värdet?
// test('Button Save should appear after button Create new is pressed', () => {
//     render(<App />);
  
//     const textbox = screen.getByRole("trixeditor");
//     fireEvent.click(trixeditor);
//     fireEvent.input("hej");
   
//     expect(textbox).toContainHTML("hej");
//   });

// Användaren ska kunna skapa ett dokument, sen trycka på selectlistan och välja samma dokument?
// Användaren ska trycka på Update-knappen utan att ha valt ett dokument i listan, och få error?