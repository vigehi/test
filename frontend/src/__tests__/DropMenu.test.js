import React from "react";
import '../matchMedia';
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../redux/configureStore";
import CustomDropMenu from '../components/book/CustomDropMenu';

describe('CustomDropMenu', () => {
  it('renders correctly', () => {
    const tree = render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomDropMenu />
        </BrowserRouter>
      </Provider>
    );
    expect(tree).toMatchSnapshot();
  });
});