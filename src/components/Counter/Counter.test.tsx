import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Counter } from './Counter';

describe('<Counter />', () => {
    it('It should show the initial value', () => {
        render(<Counter />);
        const counter = screen.getByText('Counter: 0');
        expect(counter).toBeInTheDocument();
    })

    it('Should increment the counter', async() => {
        render(<Counter />);
        const boton = screen.getByText('Increment');
        await act(() => {
            fireEvent.click(boton);
        })
        const counter = screen.getByText('Counter: 1');
        expect(counter).toBeInTheDocument();
    })
})