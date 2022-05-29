import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import Welcome from "../components/Welcome";
import {MemoryRouter} from 'react-router-dom';

describe('Welcome component', ()=> {
    test('renders content in Welcome component', () => {
        const component = render(<Welcome/>, {wrapper: MemoryRouter})

        expect(component.container).toHaveTextContent('explorer')
        expect(component.container).toHaveTextContent('BIENVENIDO')
    })
})