import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

// Mock SVG imports
jest.mock('./assets/react.svg', () => 'react-logo')
jest.mock('/vite.svg', () => 'vite-logo')

describe('App Component', () => {
  test('renders Vite + React heading', () => {
    render(<App />)
    const headingElement = screen.getByText(/Vite \+ React/i)
    expect(headingElement).toBeInTheDocument()
  })

  test('renders count button', () => {
    render(<App />)
    const buttonElement = screen.getByText(/count is/i)
    expect(buttonElement).toBeInTheDocument()
  })
})