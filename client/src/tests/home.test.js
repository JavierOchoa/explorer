import React from "react";
import {Provider} from "react-redux";
import {render} from "@testing-library/react";
import Home from "../components/Home";
import {MemoryRouter} from "react-router-dom";
import store from "../redux/store";

describe('Home component', ()=> {
    test('renders "Que lugar quieres conocer?" in Home component', () => {
        const component = render(<Provider store={store}><Home/></Provider>, {wrapper: MemoryRouter})

        expect(component.container).toHaveTextContent('Que lugar quieres conocer?')
    })
})