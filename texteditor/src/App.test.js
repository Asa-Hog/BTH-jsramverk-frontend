// import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
// import { createRoot } from 'react-dom/client';
// import ReactDOM from 'react-dom';
import App from './App';

test('button with name Update should exist', () => {
    render(<App />);

    // const container = document.getElementById("root");
    // const root = createRoot(container);
    // root.render(<App tab="home" />);

    const button = screen.getByRole("button", {name: 'Update'})

    expect(button).toBeInTheDocument();
});

test('button with name Create new should exist', () => {
  render(<App />);

  const button = screen.getByRole("button", {name: 'Create new'})

  expect(button).toBeInTheDocument();
});

test('select list should exist', () => {
  render(<App />);

  const selectList = screen.getByRole("option")

  expect(selectList).toBeInTheDocument();

});

// Användaren ska kunna se en textbox när den tryckt på 'Create new'
test('textbox should appear when button Create new is pressed', () => {
  render(<App />);

  const button = screen.getByRole("button", {name: 'Create new'});
  fireEvent.click(button);
  const textbox = screen.getByRole("textbox");

  expect(textbox).toBeInTheDocument();
});

// Användaren ska kunna se texten "Name of file" efter att ha tryckt på 'Create new'
test('Text Name of file should appear when button Create new is pressed', () => {
  render(<App />);

  const button = screen.getByRole("button", {name: 'Create new'});
  fireEvent.click(button);
  const text = screen.getByText(/Name of file/i);

  expect(text).toBeInTheDocument();
});

// Användaren ska kunna se en knapp med namn 'Save' när den tryckt på 'Create new'
test('Button Save should appear after button Create new is pressed', () => {
  render(<App />);

  const createNewButton = screen.getByRole("button", {name: 'Create new'});
  fireEvent.click(createNewButton);
  const saveButton = screen.getByRole("button", {name: 'Save'});
 
  expect(saveButton).toBeInTheDocument();
});

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